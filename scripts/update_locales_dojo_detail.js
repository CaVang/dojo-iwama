const fs = require('fs');

const viPath = './messages/vi.json';
const enPath = './messages/en.json';

const viData = JSON.parse(fs.readFileSync(viPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

viData.dojoDetail = {
    "contact": "Thông tin liên hệ",
    "register_cta": "Đăng ký Tập luyện",
    "about": "Giới thiệu",
    "schedule": "Thời khoá biểu",
    "upcoming_events": "Sự kiện sắp tới",
    "latest_blogs": "Bài viết mới nhất",
    "view_all_events": "Xem tất cả sự kiện",
    "view_all_blogs": "Xem tất cả bài viết",
    "not_found": "Không tìm thấy võ đường này.",
    "back": "Quay lại",
    "empty_state": "Võ đường này chưa có thông tin chi tiết."
};

enData.dojoDetail = {
    "contact": "Contact Information",
    "register_cta": "Register to Train",
    "about": "About",
    "schedule": "Class Schedule",
    "upcoming_events": "Upcoming Events",
    "latest_blogs": "Latest Articles",
    "view_all_events": "View all events",
    "view_all_blogs": "View all articles",
    "not_found": "Dojo not found.",
    "back": "Go back",
    "empty_state": "This dojo doesn't have detailed information yet."
};

fs.writeFileSync(viPath, JSON.stringify(viData, null, 2) + '\n');
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');

console.log('Successfully updated locales with dojoDetail!');
