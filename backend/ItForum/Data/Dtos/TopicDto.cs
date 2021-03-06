﻿using System.Collections.Generic;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class TopicDto : TopicEntity
    {
        public List<TopicDto> SubTopics { get; set; }

        public List<ThreadDto> Threads { get; set; }

        public List<ManagementDto> Managements { get; set; }

        public class ThreadDto : ThreadEntity
        {
            public UserDto CreatedBy { get; set; }
        }

        public class UserDto : UserEntity
        {
        }

        public class ManagementDto
        {
            public int UserId { get; set; }

            public UserDto User { get; set; }
        }
    }

    public class TopicMapperProfile : Profile
    {
        public TopicMapperProfile()
        {
            CreateMap<Topic, TopicDto>();
            CreateMap<Thread, TopicDto.ThreadDto>();
            CreateMap<User, TopicDto.UserDto>()
                .ForMember(d => d.Password, s => s.Ignore())
                .ForMember(d => d.Salt, s => s.Ignore());
            CreateMap<Management, TopicDto.ManagementDto>();
        }
    }
}