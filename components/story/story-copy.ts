import type { StoryChapter } from './story-types'

export const STORY_COPY = {
  eyebrow: 'Hành trình 11 năm',
  title: 'Xuân Tùng & Vân Anh',
  intro:
    'Từ những ngày đầu gặp gỡ cho đến khi quyết định cùng nhau đi hết quãng đời còn lại — đây là câu chuyện của chúng mình.',
  backLink: 'Quay lại thiệp cưới',
  imageSlotLabel: (index: number) =>
    `Ảnh kỷ niệm ${String(index + 1).padStart(2, '0')}`,
} as const

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    year: 2016,
    title: 'Lần đầu gặp gỡ',
    paragraphs: [
      'Năm ấy, chúng mình gặp nhau trong một hoàn cảnh không thể ngờ tới. Một cái nhìn, một câu chào, và những rung động đầu tiên lặng lẽ bắt đầu.',
      'Nội dung chi tiết sẽ được cập nhật sau khi có thông tin từ cô dâu chú rể.',
    ],
    imageSlotCount: 4,
  },
  {
    year: 2017,
    title: 'Những buổi hẹn đầu',
    paragraphs: [
      'Từ những cuộc trò chuyện dài đến những buổi cà phê đầu tiên, chúng mình dần hiểu về nhau nhiều hơn.',
      'Nội dung chi tiết sẽ được cập nhật sau khi có thông tin từ cô dâu chú rể.',
    ],
    imageSlotCount: 3,
  },
  {
    year: 2018,
    title: 'Yêu xa',
    paragraphs: [
      'Khoảng cách địa lý không thể ngăn được hai trái tim đồng điệu. Những cuộc gọi đêm khuya và tin nhắn dài trở thành cầu nối.',
      'Nội dung chi tiết sẽ được cập nhật sau khi có thông tin từ cô dâu chú rể.',
    ],
    imageSlotCount: 5,
  },
  {
    year: 2019,
    title: 'Gắn kết',
    paragraphs: [
      'Một năm đầy kỷ niệm đẹp, những chuyến đi chơi và những khoảnh khắc không thể quên.',
      'Nội dung chi tiết sẽ được cập nhật sau khi có thông tin từ cô dâu chú rể.',
    ],
    imageSlotCount: 4,
  },
  {
    year: 2020,
    title: 'Biến cố & vượt qua',
    paragraphs: [
      'Năm 2020 mang đến nhiều thử thách, nhưng cũng là lúc chúng mình nhận ra tầm quan trọng của nhau.',
      'Nội dung chi tiết sẽ được cập nhật sau khi có thông tin từ cô dâu chú rể.',
    ],
    imageSlotCount: 3,
  },
  {
    year: 2021,
    title: 'Bên nhau mỗi ngày',
    paragraphs: [
      'Sau những tháng ngày cách xa, chúng mình đã có thể ở bên nhau nhiều hơn và xây dựng những thói quen chung.',
      'Nội dung chi tiết sẽ được cập nhật sau khi có thông tin từ cô dâu chú rể.',
    ],
    imageSlotCount: 4,
  },
  {
    year: 2022,
    title: 'Trưởng thành cùng nhau',
    paragraphs: [
      'Hai con người, hai sự nghiệp, và một tình yêu ngày càng sâu sắc. Chúng mình cùng nhau lớn lên qua từng trải nghiệm.',
      'Nội dung chi tiết sẽ được cập nhật sau khi có thông tin từ cô dâu chú rể.',
    ],
    imageSlotCount: 5,
  },
  {
    year: 2023,
    title: 'Những dự định lớn',
    paragraphs: [
      'Bắt đầu nghĩ về tương lai chung, về một mái ấm và những kế hoạch dài hơi hơn.',
      'Nội dung chi tiết sẽ được cập nhật sau khi có thông tin từ cô dâu chú rể.',
    ],
    imageSlotCount: 4,
  },
  {
    year: 2024,
    title: 'Chuẩn bị cho đám cưới',
    paragraphs: [
      'Những tháng ngày bận rộn với kế hoạch cưới xin, nhưng ánh mắt nhìn nhau vẫn đầy hạnh phúc.',
      'Nội dung chi tiết sẽ được cập nhật sau khi có thông tin từ cô dâu chú rể.',
    ],
    imageSlotCount: 3,
  },
  {
    year: 2025,
    title: 'Quyết định cưới',
    paragraphs: [
      'Và rồi đến một ngày, cả hai cùng nói "Mình cưới nhau nhé!". Không cần quá nhiều lời, vì đáp án đã rõ từ lâu.',
      'Nội dung chi tiết sẽ được cập nhật sau khi có thông tin từ cô dâu chú rể.',
    ],
    imageSlotCount: 4,
  },
  {
    year: 2026,
    title: 'Ngày cưới',
    paragraphs: [
      'Và cuối cùng, sau 10 năm yêu thương, chúng mình đã chính thức về chung một nhà. Khoảnh khắc khoác lên mình bộ váy cưới và bộ vest, nhìn nhau và nói "Em đồng ý" — đó là ngày hạnh phúc nhất của cuộc đời.',
      'Nội dung chi tiết sẽ được cập nhật sau khi có thông tin từ cô dâu chú rể.',
    ],
    imageSlotCount: 3,
  },
]
