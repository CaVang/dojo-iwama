const fs = require('fs');

const viPath = './messages/vi.json';
const enPath = './messages/en.json';

const viData = JSON.parse(fs.readFileSync(viPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

viData.dojoSettings = {
    "title": "Thiết lập Dojo",
    "subtitle": "Quản lý thông tin hồ sơ và hiển thị công khai của võ đường.",
    "save": "Lưu thay đổi",
    "saved": "Đã lưu!",
    "save_error": "Lỗi lưu",
    "avatar_url": "Ảnh đại diện (URL)",
    "background_url": "Ảnh bìa (URL)",
    "basic_info": "Thông tin cơ bản",
    "dojo_name": "Tên Dojo",
    "dojo_name_placeholder": "Nhập tên võ đường...",
    "chief_instructor": "Chủ nhiệm / Giáo viên trưởng",
    "chief_instructor_placeholder": "Nhập tên chủ nhiệm...",
    "description_label": "Giới thiệu ngắn",
    "description_placeholder": "Mô tả ngắn gọn về võ đường của bạn...",
    "address_section": "Địa chỉ & Vị trí",
    "address": "Địa chỉ",
    "address_placeholder": "Tìm kiếm địa chỉ...",
    "address_hint": "Gõ địa chỉ để tìm kiếm tự động. Chọn từ danh sách để tự động điền tọa độ.",
    "latitude": "Vĩ độ",
    "longitude": "Kinh độ",
    "contact_section": "Thông tin liên hệ",
    "phone": "Số điện thoại",
    "email_label": "Email"
};

enData.dojoSettings = {
    "title": "Dojo Settings",
    "subtitle": "Manage your dojo's profile and public display information.",
    "save": "Save Changes",
    "saved": "Saved!",
    "save_error": "Save Error",
    "avatar_url": "Avatar Image (URL)",
    "background_url": "Cover Image (URL)",
    "basic_info": "Basic Information",
    "dojo_name": "Dojo Name",
    "dojo_name_placeholder": "Enter dojo name...",
    "chief_instructor": "Chief Instructor",
    "chief_instructor_placeholder": "Enter chief instructor name...",
    "description_label": "Short Description",
    "description_placeholder": "A brief description of your dojo...",
    "address_section": "Address & Location",
    "address": "Address",
    "address_placeholder": "Search for an address...",
    "address_hint": "Type an address to search. Select from the dropdown to auto-fill coordinates.",
    "latitude": "Latitude",
    "longitude": "Longitude",
    "contact_section": "Contact Information",
    "phone": "Phone Number",
    "email_label": "Email"
};

fs.writeFileSync(viPath, JSON.stringify(viData, null, 2) + '\n');
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');

console.log('Successfully updated locales with dojoSettings!');
