using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeduplicateController : ControllerBase
    {
        private static List<Client> clients = new List<Client>();

        [HttpGet]
        [Route("clients")]
        public IActionResult GetClients()
        {
            return Ok(clients);
        }

        [HttpPost]
        [Route("clients")]
        public IActionResult CreateClient([FromBody] Client client)
        {
            client.Id = Guid.NewGuid().ToString();
            clients.Add(client);

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> DeduplicateFiles(IFormCollection form)
        {
            string selectedClientId = form["client"];
            string newClientName = form["newClient"];
            var file1 = form.Files["file1"];
            var file2 = form.Files["file2"];

            // Check if files exist
            if (file1 == null || file2 == null)
            {
                return BadRequest("Please upload both File 1 and File 2.");
            }

            // Perform deduplication logic here
            try
            {
                // Read file data
                var file1Data = ReadFileData(file1);
                var file2Data = ReadFileData(file2);

                // Deduplicate the files based on street address, city, state, and zip code
                var deduplicatedData = DeduplicateFiles(file1Data, file2Data);

                // Create a clean file with the deduplicated data
                var cleanFileBytes = CreateCleanFile(deduplicatedData);

                // Generate a unique file name
                var cleanFileName = $"{Guid.NewGuid()}.csv";

                // Save the clean file to a temporary location
                var cleanFilePath = Path.Combine(Path.GetTempPath(), cleanFileName);
                await System.IO.File.WriteAllBytesAsync(cleanFilePath, cleanFileBytes);

                // Return the clean file URL
                var cleanFileURL = GetCleanFileURL(cleanFileName);

                // Add the client to the clean files
                var client = selectedClientId != "" ? clients.FirstOrDefault(c => c.Id == selectedClientId) : new Client { Name = newClientName };
                client.CleanFiles.Add(cleanFileURL);

                return Ok(new { cleanFileURL });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deduplicating the files: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("send-to-accuzip")]
        public async Task<IActionResult> SendToAccuZIP([FromBody] AccuZIPRequest request)
        {
            
            var response = new AccuZIPResponse
            {
                Success = true,
                Message = "File sent to AccuZIP successfully.",
            };

            return Ok(response);
        }

        [HttpPost]
        [Route("send-email")]
        public IActionResult SendEmail([FromBody] EmailRequest request)
        {
            

            try
            {
                var cleanFileURL = request.FileURL;

                // Example implementation using System.Net.Mail
                using (var client = new SmtpClient("your-smtp-server"))
                {
                    var message = new MailMessage();
                    message.From = new MailAddress("sender@example.com");
                    message.To.Add("client@example.com");
                    message.Subject = "AccuZIP File";
                    message.Body = $"Please find the AccuZIP file attached. Download link: {cleanFileURL}";

                    // Attach the clean file to the email
                    var cleanFileName = Path.GetFileName(cleanFileURL);
                    var attachment = new Attachment(cleanFileURL);
                    attachment.Name = cleanFileName;
                    message.Attachments.Add(attachment);

                    client.Send(message);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while sending the email: {ex.Message}");
            }
        }

        private List<Dictionary<string, string>> ReadFileData(IFormFile file)
        {
           
            
            var fileData = new List<Dictionary<string, string>>();

            // Read the file content
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                var headers = reader.ReadLine()?.Split(',');

                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    var columns = line.Split(',');

                    var data = new Dictionary<string, string>();

                    // structure of the file is: address, city, state, zip code
                    for (var i = 0; i < headers.Length; i++)
                    {
                        data[headers[i]] = columns[i].Trim();
                    }

                    // Skip empty or invalid data rows
                    if (data.Count > 0)
                    {
                        fileData.Add(data);
                    }
                }
            }

            return fileData;
        }

        private List<Dictionary<string, string>> DeduplicateFiles(List<Dictionary<string, string>> file1Data, List<Dictionary<string, string>> file2Data)
        {
            
            var deduplicatedData = new List<Dictionary<string, string>>();

            // Deduplicate logic here...

            return deduplicatedData;
        }

        private byte[] CreateCleanFile(List<Dictionary<string, string>> deduplicatedData)
        {
            // Create a clean file with the deduplicated data
            // Modify this method based on the structure and format of your files
            
            using (var stream = new MemoryStream())
            {
                using (var writer = new StreamWriter(stream))
                {
                    // Write the headers
                    var headers = deduplicatedData.First().Keys;
                    writer.WriteLine(string.Join(",", headers));

                    // Write the data rows
                    foreach (var row in deduplicatedData)
                    {
                        var values = row.Values;
                        writer.WriteLine(string.Join(",", values));
                    }

                    writer.Flush();
                }

                return stream.ToArray();
            }
        }

        private string GetCleanFileURL(string fileName)
        {
            // Return the URL of the clean file
            // Modify this method based on your file storage configuration
            
            var baseUrl = "https://your-file-storage-url";
            var cleanFileURL = $"{baseUrl}/{fileName}";

            return cleanFileURL;
        }
    }

    public class Client
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<string> CleanFiles { get; set; } = new List<string>();
    }

    public class AccuZIPRequest
    {
        public List<string> CleanFiles { get; set; }
    }

    public class AccuZIPResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class EmailRequest
    {
        public string FileURL { get; set; }
    }
}
