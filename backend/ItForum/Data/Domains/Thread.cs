﻿using System.Collections.Generic;
using ItForum.Data.Entities;

namespace ItForum.Data.Domains
{
    public class Thread : ThreadEntity
    {
        public User User { get; set; }

        public Discussion Discussion { get; set; }

        public List<Post> Posts { get; set; }
    }
}