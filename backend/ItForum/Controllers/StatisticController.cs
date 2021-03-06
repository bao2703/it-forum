﻿using System;
using System.Linq;
using ItForum.Data.Domains;
using ItForum.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ItForum.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize(Roles = nameof(Role.Administrator))]
    public class StatisticController : Controller
    {
        private readonly PostService _postService;
        private readonly ThreadService _threadService;
        private readonly TopicService _topicService;

        public StatisticController(TopicService topicService, ThreadService threadService, PostService postService)
        {
            _topicService = topicService;
            _threadService = threadService;
            _postService = postService;
        }

        [HttpGet("threads-per-topic")]
        public IActionResult ThreadsPerTopic()
        {
            var topics = _topicService.FindByNoTracking(x => x.Level == 0, "SubTopics");
            return Ok(topics.Select(x => new
            {
                Key = x.Name,
                Value = x.SubTopics.Sum(s => s.NumberOfThreads)
            }).OrderBy(x => x.Value).TakeLast(7));
        }

        [HttpGet("posts-per-topic")]
        public IActionResult PostsPerTopic()
        {
            var topics = _topicService.FindByNoTracking(x => x.Level == 0, "SubTopics.Threads");
            return Ok(topics.Select(x => new
            {
                Key = x.Name,
                Value = x.SubTopics.Sum(s => s.Threads.Sum(t => t.NumberOfPosts))
            }).OrderBy(x => x.Value).TakeLast(7));
        }

        [HttpGet("threads-per-month")]
        public IActionResult ThreadsPerMonth()
        {
            var threads = _threadService.FindAllNoTracking();
            return Ok(threads.GroupBy(x => new DateTime(x.DateCreated.Value.Year, x.DateCreated.Value.Month, 1))
                .Select(x => new
                {
                    Key = new
                    {
                        x.Key.Year,
                        x.Key.Month
                    },
                    Value = x.Count()
                }).OrderBy(x => x.Key.Year).ThenBy(x => x.Key.Month));
        }

        [HttpGet("posts-per-month")]
        public IActionResult PostsPerMonth()
        {
            var posts = _postService.FindAllNoTracking();
            return Ok(posts.GroupBy(x => new DateTime(x.DateCreated.Value.Year, x.DateCreated.Value.Month, 1))
                .Select(x => new
                {
                    Key = new
                    {
                        x.Key.Year,
                        x.Key.Month
                    },
                    Value = x.Count()
                }).OrderBy(x => x.Key.Year).ThenBy(x => x.Key.Month));
        }
    }
}