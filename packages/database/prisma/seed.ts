import { PrismaClient, ContentType, ContentStatus, ReleaseStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Start Mass Seeding Cinematic Data ---');

  // 1. Roles & Permissions
  const adminRole = await prisma.role.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: { name: 'super_admin', description: 'Toàn quyền hệ thống' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user', description: 'Người dùng phổ thông' },
  });

  // 2. Genres
  const genreData = [
    { name: 'Hành động', slug: 'hanh-dong' },
    { name: 'Phiêu lưu', slug: 'phieu-luu' },
    { name: 'Hài hước', slug: 'hai-huoc' },
    { name: 'Kịch tính', slug: 'kich-tinh' },
    { name: 'Kinh dị', slug: 'kinh-di' },
    { name: 'Lãng mạn', slug: 'lang-man' },
    { name: 'Khoa học viễn tưởng', slug: 'khoa-hoc-vien-tuong' },
    { name: 'Fantasy', slug: 'fantasy' },
    { name: 'Trinh thám', slug: 'trinh-tham' },
    { name: 'Võ thuật', slug: 'vo-thuat' },
    { name: 'Đời thường', slug: 'doi-thuong' },
    { name: 'Học đường', slug: 'hoc-duong' },
    { name: 'Cổ trang', slug: 'co-trang' },
    { name: 'Tâm lý', slug: 'tam-ly' },
    { name: 'Bí ẩn', slug: 'bi-an' },
    { name: 'Siêu nhiên', slug: 'sieu-nhien' },
  ];

  const genres: any[] = [];
  for (const g of genreData) {
    const genre = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
    genres.push(genre);
  }

  // 3. Countries
  const countryData = [
    { name: 'Việt Nam', slug: 'viet-nam' },
    { name: 'Nhật Bản', slug: 'nhat-ban' },
    { name: 'Hàn Quốc', slug: 'han-quoc' },
    { name: 'Hoa Kỳ', slug: 'hoa-ky' },
    { name: 'Trung Quốc', slug: 'trung-quoc' },
    { name: 'Anh', slug: 'anh' },
    { name: 'Pháp', slug: 'phap' },
  ];

  const countries: any[] = [];
  for (const c of countryData) {
    const country = await prisma.country.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    countries.push(country);
  }

  // 4. Studios
  const studioData = [
    { name: 'MAPPA', slug: 'mappa' },
    { name: 'Ufotable', slug: 'ufotable' },
    { name: 'Warner Bros.', slug: 'warner-bros' },
    { name: 'Marvel Studios', slug: 'marvel-studios' },
    { name: 'Studio Ghibli', slug: 'studio-ghibli' },
    { name: 'A-1 Pictures', slug: 'a1-pictures' },
    { name: 'WIT Studio', slug: 'wit-studio' },
    { name: 'Madhouse', slug: 'madhouse' },
  ];

  for (const s of studioData) {
    await prisma.studio.upsert({ where: { slug: s.slug }, update: {}, create: s });
  }

  // 5. Users
  const hashedPassword = "$2b$10$EpjX0Z.6.6.6.6.6.6.6.6.6.6.6.6.6.6.6.6.6.6.6.6.6.6.6.6.6"; // Static hash for 'password123'
  const users: any[] = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@cinestream.com` },
      update: {},
      create: {
        email: `user${i}@cinestream.com`,
        username: `cine_fan_${i}_${Math.floor(Math.random() * 1000)}`,
        passwordHash: hashedPassword,
        displayName: `Cine Lover ${i}`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
        roleId: userRole.id,
      },
    });
    users.push(user);
  }

  // 6. Banners
  const bannerData = [
    { 
      title: 'Solo Leveling: Arise', 
      subtitle: 'Trải nghiệm đỉnh cao hành động Anime 2024',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
      linkUrl: '/contents/solo-leveling'
    },
    { 
      title: 'Dune: Part Two', 
      subtitle: 'Siêu phẩm sử thi khoa học viễn tưởng của Denis Villeneuve',
      imageUrl: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2070&auto=format&fit=crop',
      linkUrl: '/contents/dune-part-two'
    },
    { 
      title: 'Oppenheimer', 
      subtitle: 'Kẻ hủy diệt thế giới - Siêu phẩm của Christopher Nolan',
      imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop',
      linkUrl: '/contents/oppenheimer'
    },
    { 
      title: 'The Boy and the Heron', 
      subtitle: 'Tuyệt tác hoạt hình cuối cùng của Hayao Miyazaki',
      imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2150&auto=format&fit=crop',
      linkUrl: '/contents/the-boy-and-the-heron'
    },
    { 
      title: 'Spider-Man: Across the Spider-Verse', 
      subtitle: 'Hành trình xuyên đa vũ trụ rực rỡ sắc màu',
      imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=2070&auto=format&fit=crop',
      linkUrl: '/contents/spider-man-across-the-spider-verse'
    }
  ];

  await prisma.banner.deleteMany({});
  for (const b of bannerData) {
    await prisma.banner.create({ data: b });
  }

  // 7. MASS CONTENT SEEDING

  const animeTitles: string[] = [
    'Solo Leveling', 'Jujutsu Kaisen', 'Demon Slayer', 'Attack on Titan', 'One Piece', 
    'Naruto: Shippuden', 'Bleach: TYBW', 'Oshi no Ko', 'Frieren: Beyond Journey\'s End', 'Spy x Family'
  ];

  const movieTitles: string[] = [
    'Dune: Part Two', 'Oppenheimer', 'Interstellar', 'The Dark Knight', 'Inception',
    'Avatar: The Way of Water', 'Avengers: Endgame', 'Joker', 'Parasite', 'Everything Everywhere All at Once'
  ];

  const mangaTitles: string[] = [
    'Chainsaw Man', 'Berserk', 'Vagabond', 'Monster', 'Kingdom',
    'Blue Lock', 'Sakamoto Days', 'Vinland Saga', 'Steel Ball Run', 'Grand Blue'
  ];

  const storyTitles: string[] = [
    'Shadow Slave', 'Lord of the Mysteries', 'Reverend Insanity', 'The Beginning After the End', 'Omniscient Reader\'s Viewpoint',
    'The Second Coming of Gluttony', 'Trash of the Count\'s Family', 'Solo Leveling (Novel)', 'Overgeared', 'Second Life Ranker'
  ];

  // Helper to get random genres
  const getRandomGenres = (count: number) => {
    const shuffled = [...genres].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(g => ({ genreId: g.id }));
  };

  // 7.1 Seed Anime
  console.log('Seeding Anime...');
  for (const title of animeTitles) {
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/:/g, '').replace(/'/g, '');
    await prisma.content.upsert({
      where: { slug },
      update: {},
      create: {
        type: ContentType.ANIME,
        title,
        slug,
        description: `Mô tả hấp dẫn cho bộ Anime ${title}. Một hành trình đầy cảm xúc và kịch tính.`,
        posterUrl: `https://picsum.photos/seed/${slug}/600/900`,
        backgroundUrl: `https://picsum.photos/seed/${slug}-bg/1920/1080`,
        releaseYear: 2020 + Math.floor(Math.random() * 5),
        ratingAvg: 8.5 + Math.random() * 1.5,
        viewCount: 100000 + Math.floor(Math.random() * 5000000),
        status: ContentStatus.PUBLISHED,
        releaseStatus: Math.random() > 0.3 ? ReleaseStatus.ONGOING : ReleaseStatus.COMPLETED,
        genres: { create: getRandomGenres(3) },
        anime: {
          create: {
            totalEpisodes: 24,
            currentEpisodes: 12,
            season: 'Winter 2024',
            episodes: {
              create: Array.from({ length: 6 }).map((_, i: number) => ({
                episodeNum: i + 1,
                title: `Tập ${i + 1}: ${title} khởi đầu`,
                description: `Mô tả tập ${i + 1} của ${title}.`,
                thumbnailUrl: `https://picsum.photos/seed/${slug}-ep${i}/500/300`,
                sources: {
                  create: [
                    { quality: '1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', manifestUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
                    { quality: '720p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', manifestUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
                  ]
                }
              }))
            }
          }
        }
      }
    });
  }

  // 7.2 Seed Movies
  console.log('Seeding Movies...');
  for (const title of movieTitles) {
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/:/g, '').replace(/'/g, '');
    await prisma.content.upsert({
      where: { slug },
      update: {},
      create: {
        type: ContentType.MOVIE,
        title,
        slug,
        description: `Mô tả cực hay cho bộ phim ${title}. Trải nghiệm điện ảnh không thể bỏ lỡ.`,
        posterUrl: `https://picsum.photos/seed/${slug}/600/900`,
        backgroundUrl: `https://picsum.photos/seed/${slug}-bg/1920/1080`,
        releaseYear: 2010 + Math.floor(Math.random() * 15),
        ratingAvg: 8.0 + Math.random() * 2.0,
        viewCount: 500000 + Math.floor(Math.random() * 10000000),
        status: ContentStatus.PUBLISHED,
        releaseStatus: ReleaseStatus.COMPLETED,
        genres: { create: getRandomGenres(2) },
        movie: {
          create: { duration: 90 + Math.floor(Math.random() * 90) }
        }
      }
    });
  }

  // 7.3 Seed Manga
  console.log('Seeding Manga...');
  for (const title of mangaTitles) {
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/:/g, '').replace(/'/g, '');
    await prisma.content.upsert({
      where: { slug },
      update: {},
      create: {
        type: ContentType.MANGA,
        title,
        slug,
        description: `Tác phẩm Manga kinh điển ${title}. Nghệ thuật đỉnh cao và cốt truyện sâu sắc.`,
        posterUrl: `https://picsum.photos/seed/${slug}/600/900`,
        backgroundUrl: `https://picsum.photos/seed/${slug}-bg/1920/1080`,
        ratingAvg: 9.0 + Math.random() * 1.0,
        viewCount: 200000 + Math.floor(Math.random() * 8000000),
        status: ContentStatus.PUBLISHED,
        releaseStatus: Math.random() > 0.5 ? ReleaseStatus.ONGOING : ReleaseStatus.COMPLETED,
        genres: { create: getRandomGenres(3) },
        manga: {
          create: {
            author: 'Tác giả nổi tiếng',
            chapters: {
              create: Array.from({ length: 10 }).map((_, i: number) => ({
                chapterNum: i + 1,
                title: `Chương ${i + 1}: Hồi kết của ${title}`,
                pages: {
                  create: Array.from({ length: 10 }).map((_, p: number) => ({
                    pageNum: p + 1,
                    imageUrl: `https://picsum.photos/seed/manga-${slug}-${i}-${p}/800/1200`
                  }))
                }
              }))
            }
          }
        }
      }
    });
  }

  // 7.4 Seed Stories
  console.log('Seeding Stories...');
  for (const title of storyTitles) {
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/:/g, '').replace(/'/g, '').replace(/\(/g, '').replace(/\)/g, '');
    await prisma.content.upsert({
      where: { slug },
      update: {},
      create: {
        type: ContentType.STORY,
        title,
        slug,
        description: `Tiểu thuyết mạng đình đám ${title}. Thế giới kỳ ảo và những cuộc phiêu lưu bất tận.`,
        posterUrl: `https://picsum.photos/seed/${slug}/600/900`,
        backgroundUrl: `https://picsum.photos/seed/${slug}-bg/1920/1080`,
        ratingAvg: 9.5 + Math.random() * 0.5,
        viewCount: 1000000 + Math.floor(Math.random() * 20000000),
        status: ContentStatus.PUBLISHED,
        releaseStatus: ReleaseStatus.ONGOING,
        genres: { create: getRandomGenres(2) },
        story: {
          create: {
            author: 'Writer Legend',
            chapters: {
              create: Array.from({ length: 20 }).map((_, i: number) => ({
                chapterNum: i + 1,
                title: `Chương ${i + 1}: Đại chiến ${title}`,
                content: `Đây là nội dung giả cực kỳ dài cho chương ${i + 1} của bộ truyện ${title}. Nhân vật chính đang đối mặt với những thử thách kinh hoàng nhất từ trước đến nay. Bầu trời tối sầm lại, sấm sét nổ vang khắp nơi. Phép thuật bùng nổ, kiếm khí xé toạc không gian. Mọi người đều nín thở theo dõi từng cử động của anh... Nội dung tiếp tục được cập nhật hàng ngày với những tình tiết gay cấn không thể rời mắt.`
              }))
            }
          }
        }
      }
    });
  }

  // 7.5 Seed User Request: Hào Quang Đôi Ta (BL Manga)
  console.log('Seeding Hào Quang Đôi Ta...');
  await prisma.content.upsert({
    where: { slug: 'hao-quang-doi-ta' },
    update: {},
    create: {
      type: ContentType.MANGA,
      title: 'Hào Quang Đôi Ta',
      slug: 'hao-quang-doi-ta',
      description: 'Một câu chuyện lãng mạn nhẹ nhàng về sự đồng cảm và tình yêu chớm nở giữa hai tâm hồn cô đơn. Khi ánh hào quang của người này sưởi ấm trái tim của người kia, cuộc sống của họ bắt đầu thay đổi mãi mãi.',
      posterUrl: 'https://i.redd.it/ceetrhas51441.jpg',
      backgroundUrl: 'https://i.redd.it/ceetrhas51441.jpg',
      ratingAvg: 9.8,
      viewCount: 1500000,
      status: ContentStatus.PUBLISHED,
      releaseStatus: ReleaseStatus.ONGOING,
      genres: { create: getRandomGenres(2) },
      manga: {
        create: {
          author: 'Kishimoto',
          chapters: {
            create: Array.from({ length: 5 }).map((_, i: number) => ({
              chapterNum: i + 1,
              title: `Chương ${i + 1}: Khởi đầu mới`,
              pages: {
                create: Array.from({ length: 8 }).map((_, p: number) => ({
                  pageNum: p + 1,
                  imageUrl: `https://picsum.photos/seed/bl-manga-${i}-${p}/800/1200`
                }))
              }
            }))
          }
        }
      }
    }
  });

  // 8. Interactions
  console.log('--- Seeding Thousands of Interactions ---');
  const allContents = await prisma.content.findMany();
  
  for (const user of users) {
    // Randomly interact with 10-15 contents
    const interactions = allContents.sort(() => 0.5 - Math.random()).slice(0, 15);
    
    for (const content of interactions) {
      // 50% chance to rate
      if (Math.random() > 0.5) {
        await prisma.rating.upsert({
          where: { userId_contentId: { userId: user.id, contentId: content.id } },
          update: {},
          create: { userId: user.id, contentId: content.id, score: 4 + Math.floor(Math.random() * 2) }
        });
      }

      // 30% chance to favorite
      if (Math.random() > 0.7) {
        await prisma.favorite.upsert({
          where: { userId_contentId: { userId: user.id, contentId: content.id } },
          update: {},
          create: { userId: user.id, contentId: content.id }
        });
      }

      // 20% chance to comment
      if (Math.random() > 0.8) {
        await prisma.comment.create({
          data: {
            userId: user.id,
            contentId: content.id,
            text: `Bộ ${content.title} này xem/đọc cuốn thực sự, đánh giá cao chất lượng!`
          }
        });
      }
    }
  }

  console.log('--- Mass Seeding Finished Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
