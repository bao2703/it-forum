using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ItForum.Data.Domains;
using ItForum.Data.Entities;

namespace ItForum.Data.Dtos
{
    public class ThreadDto : ThreadEntity
    {
        public int Point { get; set; }

        public TopicDto Topic { get; set; }

        public UserDto CreatedBy { get; set; }

        public List<PostDto> Posts { get; set; }

        public List<TagDto> Tags { get; set; }

        public class PostDto : PostEntity
        {
            public UserDto CreatedBy { get; set; }

            public List<VoteDto> Votes { get; set; }

            public List<PostDto> Replies { get; set; }
        }

        public class UserDto : UserEntity
        {
        }

        public class TagDto : TagEntity
        {
        }

        public class TopicDto : TopicEntity
        {
            public TopicDto Parent { get; set; }

            public List<ManagementDto> Managements { get; set; }
        }

        public class VoteDto
        {
            public int UserId { get; set; }

            public int Like { get; set; }
        }

        public class ManagementDto
        {
            public int UserId { get; set; }

            public UserDto User { get; set; }
        }
    }

    public class ThreadMapperProfile : Profile
    {
        public ThreadMapperProfile()
        {
            CreateMap<Thread, ThreadDto>()
                .ForMember(d => d.Tags, s => s.MapFrom(t => t.ThreadTags.Select(tt => tt.Tag)));
            CreateMap<User, ThreadDto.UserDto>()
                .ForMember(d => d.Password, s => s.Ignore())
                .ForMember(d => d.Salt, s => s.Ignore());
            CreateMap<Post, ThreadDto.PostDto>();
            CreateMap<Tag, ThreadDto.TagDto>();
            CreateMap<Topic, ThreadDto.TopicDto>();
            CreateMap<Vote, ThreadDto.VoteDto>();
            CreateMap<Management, ThreadDto.ManagementDto>();

            CreateMap<ThreadDto, Thread>();
            CreateMap<ThreadDto.UserDto, User>();
            CreateMap<ThreadDto.PostDto, Post>();
            CreateMap<ThreadDto.TagDto, Tag>();
            CreateMap<ThreadDto.TopicDto, Topic>();
            CreateMap<ThreadDto.VoteDto, Vote>();
            CreateMap<ThreadDto.ManagementDto, Management>();
        }
    }
}