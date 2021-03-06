﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bogus;
using ItForum.Data.Domains;
using ItForum.Services;
using MoreLinq;

namespace ItForum.Data.Seeds
{
    public class DataSeeder
    {
        private readonly TdtGameContext _context;
        private readonly HelperService _helperService;
        private readonly UserService _userService;

        public DataSeeder(TdtGameContext context, UserService userService, HelperService helperService)
        {
            _context = context;
            _userService = userService;
            _helperService = helperService;
        }

        public async Task InitializeAsync()
        {
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            var tagFaker = new Faker<Tag>().Rules((f, o) =>
            {
                o.Name = f.Name.JobArea();
                o.DateCreated = f.Date.Past(3);
            });

            var tags = tagFaker.Generate(10);

            var userFaker = new Faker<User>().Rules((f, o) =>
            {
                o.Name = f.Name.FindName();
                o.Phone = f.Person.Phone;
                o.Birthdate = f.Person.DateOfBirth;
                o.Avatar = f.Internet.Avatar();
                o.Email = f.Person.Email.ToLower();
                o.Salt = _helperService.CreateSalt();
                o.Password = _helperService.Hash("1", o.Salt);
                o.ApprovalStatus = ApprovalStatus.Pending;
                o.Role = f.PickRandom(o.Role);
                o.DateCreated = f.Date.Past(4);
            });

            var admin = userFaker.Generate();
            admin.Email = "admin@gmail.com";
            admin.Role = Role.Administrator;
            _context.Add(admin);
            await _context.SaveChangesAsync();
            admin.ApprovalStatusModifiedBy = admin;
            admin.ApprovalStatus = ApprovalStatus.Approved;

            var index = 1;
            var admins = userFaker.Generate(25);
            admins.ToList().ForEach(x =>
            {
                x.Role = Role.Administrator;
                x.Name = $"admin{index}";
                x.Email = $"admin{index++}@gmail.com";
                x.ApprovalStatusModifiedBy = admin;
                x.ApprovalStatus = ApprovalStatus.Approved;
            });
            _context.Users.AddRange(admins);
            await _context.SaveChangesAsync();

            index = 1;
            var mods = userFaker.Generate(25).ToList();
            mods.ForEach(x =>
            {
                x.Role = Role.Moderator;
                x.Name = $"mod{index}";
                x.Email = $"mod{index++}@gmail.com";
                x.ApprovalStatusModifiedBy = admin;
                x.ApprovalStatus = ApprovalStatus.Approved;
            });
            _context.Users.AddRange(mods);
            await _context.SaveChangesAsync();

            index = 1;
            var users = userFaker.Generate(25).ToList();
            users.ForEach(x =>
            {
                x.Role = Role.None;
                x.Name = $"user{index}";
                x.Email = $"user{index++}@gmail.com";
                x.ApprovalStatusModifiedBy = admin;
                x.ApprovalStatus = ApprovalStatus.Approved;
            });
            _context.Users.AddRange(users);
            await _context.SaveChangesAsync();

            var postFaker = new Faker<Post>().Rules((f, o) =>
            {
                o.Content = f.Lorem.Paragraphs(f.Random.Number(1, 4), "<div></div>");
                o.CreatedBy = f.PickRandom(users);
                o.ApprovalStatus = ApprovalStatus.Pending;
                if (f.Random.Number(0, 5) != 0)
                {
                    o.ApprovalStatus = ApprovalStatus.Approved;
                    o.ApprovalStatusModifiedBy = admin;
                }
                o.DateCreated = f.Date.Past(3);

                var temp = new List<User>(users);
                var votes = new List<Vote>();
                for (var i = 0; i < f.Random.Number(0, 5); i++)
                {
                    var u = f.PickRandom(temp);
                    temp.Remove(u);
                    votes.Add(new Vote {User = u, Like = f.Random.Bool()});
                }
                o.Votes = votes.ToList();
                o.Point = _helperService.CaculatePoint(o.Votes);
            });

            var threadFaker = new Faker<Thread>().Rules((f, o) =>
            {
                o.Title = f.Lorem.Sentence();
                o.CreatedBy = f.PickRandom(users);
                o.Views = f.Random.Number(1, 10000);
                o.Pin = false;
                o.NumberOfPosts = 0;
                o.Posts = postFaker.Generate(f.Random.Number(3, 20)).ToList();
                o.NumberOfPosts += o.Posts.Count(x => x.ApprovalStatus == ApprovalStatus.Approved);
                o.Posts.ForEach(x =>
                {
                    x.Replies = postFaker.Generate(f.Random.Number(0, 2)).ToList();
                    x.Replies.ForEach(y => y.Thread = o);
                    o.NumberOfPosts += x.Replies.Count(z => z.ApprovalStatus == ApprovalStatus.Approved);
                });
                var p = o.Posts.OrderBy(x => x.DateCreated).FirstOrDefault();
                p.CreatedBy = o.CreatedBy;
                o.DateCreated = p.DateCreated;
                o.LastActivity = o.Posts.OrderByDescending(x => x.DateCreated).FirstOrDefault().DateCreated.Value;

                if (f.Random.Number(0, 3) != 0)
                {
                    o.ApprovalStatus = ApprovalStatus.Approved;
                    o.ApprovalStatusModifiedBy = admin;
                }
                else
                {
                    p.ApprovalStatus = ApprovalStatus.Pending;
                    p.Replies.Clear();
                    o.Posts.Clear();
                    o.Posts.Add(p);
                    o.NumberOfPosts = 1;
                    o.LastActivity = p.DateCreated.Value;
                }

                var temp = new List<Tag>(tags);
                var threadTags = new List<ThreadTag>();
                for (var i = 0; i < f.Random.Number(2, 4); i++)
                {
                    var t = f.PickRandom(temp);
                    temp.Remove(t);
                    threadTags.Add(new ThreadTag {Tag = t});
                }
                o.ThreadTags = threadTags.ToList();
            });

            var topicFaker = new Faker<Topic>().Rules((f, o) =>
            {
                o.Name = f.Commerce.ProductName();
                o.Description = f.Lorem.Sentences(3);
                o.CreatedBy = admin;
                o.DateCreated = f.Date.Past(4);

                var temp = new List<User>(mods);
                var managements = new List<Management>();
                for (var i = 0; i < f.Random.Number(1, 5); i++)
                {
                    var u = f.PickRandom(temp);
                    temp.Remove(u);
                    managements.Add(new Management {User = u});
                }
                o.Managements = managements.ToList();
            });

            var topics = topicFaker.Generate(5);
            var order = 0;
            topics.ForEach(x =>
            {
                x.Level = 0;
                x.OrderIndex = order++;
            });

            topics[0].Name = "C++";
            topics[0].Description = "General discussions about C++";
            topics[0].SubTopics = topicFaker.Generate(3).ToList();
            topics[0].SubTopics[0].Name = "C++ For Beginner";
            topics[0].SubTopics[0].Description = "Discussions about C++ programming for beginners";
            topics[0].SubTopics[1].Name = "Advanced C++";
            topics[0].SubTopics[1].Description = "Discussions about C++ Advanced programming";
            topics[0].SubTopics[2].Name = "Linux-Unix";
            topics[0].SubTopics[2].Description = "Programming C++ for Unix and Linux";

            topics[1].Name = "C#";
            topics[1].Description = "General discussions about C#";
            topics[1].SubTopics = topicFaker.Generate(6).ToList();
            topics[1].SubTopics[0].Name = "C# For Beginner";
            topics[1].SubTopics[0].Description = "Discussions about C# programming for beginners";
            topics[1].SubTopics[1].Name = "Advanced C#";
            topics[1].SubTopics[1].Description = "Discussions about C++ Advanced programming";
            topics[1].SubTopics[2].Name = "Unity";
            topics[1].SubTopics[2].Description = "Discussions about Unity and game programing";
            topics[1].SubTopics[3].Name = "Windows Forms";
            topics[1].SubTopics[3].Description = "Discussion related to Winforms application development";
            topics[1].SubTopics[4].Name = "ASP.NET";
            topics[1].SubTopics[4].Description = "General discussion on ASP.NET development with C#";
            topics[1].SubTopics[5].Name = "Design / CSS";
            topics[1].SubTopics[5].Description = "Web Page Design, Cascading Style Sheets, etc.";

            topics[2].Name = "Java";
            topics[2].Description = "General discussions about Java";
            topics[2].SubTopics = topicFaker.Generate(2).ToList();
            topics[2].SubTopics[0].Name = "Java For Beginner";
            topics[2].SubTopics[0].Description = "Discussions about Java programming for beginners";
            topics[2].SubTopics[1].Name = "Advanced Java";
            topics[2].SubTopics[1].Description = "Discussions about Java Advanced programming";

            topics[3].Name = "Database";
            topics[3].Description = "General discussions about Database";
            topics[3].SubTopics = topicFaker.Generate(2).ToList();
            topics[3].SubTopics[0].Name = "SQL Server";
            topics[3].SubTopics[0].Description = "Discussion related to SQL Server";
            topics[3].SubTopics[1].Name = "MySQL Server";
            topics[3].SubTopics[1].Description = "Discussion related to MySQL Server";

            topics[4].Name = "Help";
            topics[4].Description = "Help";
            topics[4].SubTopics = topicFaker.Generate(2).ToList();
            topics[4].SubTopics[0].Name = "FAQs";
            topics[4].SubTopics[0].Description = "FAQs";
            topics[4].SubTopics[1].Name = "Questions & Bugs Reports";
            topics[4].SubTopics[1].Description = "Report bugs here";

            topics.ForEach(x =>
            {
                var f = new Faker();
                x.SubTopics.ForEach(s =>
                {
                    s.Level = 1;
                    s.Threads = threadFaker.Generate(f.Random.Number(5, 20)).ToList();
                    for (var i = 0; i < f.Random.Number(1, 5); i++)
                    {
                        var t = f.PickRandom(s.Threads);
                        s.Threads.Remove(t);
                        t.Pin = true;
                        s.Threads.Add(t);
                    }
                    s.NumberOfThreads = s.Threads.Count(th => th.ApprovalStatus == ApprovalStatus.Approved);
                });
            });

            _context.AddRange(topics);

            users = userFaker.Generate(20).ToList();
            users.ForEach(x =>
            {
                x.Role = Role.None;
                x.Name = $"user{index}";
                x.Email = $"user{index++}@gmail.com";
            });
            _context.AddRange(users);

            await _context.SaveChangesAsync();
        }
    }
}