const fs = require('fs');

const viPath = './messages/vi.json';
const enPath = './messages/en.json';

const viData = JSON.parse(fs.readFileSync(viPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const blogVi = {
    "public": {
        "title": "Góc chia sẻ & Tin tức",
        "description": "Cập nhật thông tin mới nhất, các bài viết tâm huyết và tường thuật sự kiện từ võ đường của chúng tôi.",
        "empty": "Chưa có bài viết nào",
        "empty_desc": "Các tác giả của võ đường đang cập nhật nội dung. Hãy quay lại sau nhé!",
        "event_badge": "Sự kiện",
        "read_more": "Đọc tiếp",
        "back_to_list": "Quay lại danh sách Blogs",
        "not_found": "Bài viết không tồn tại hoặc đã bị ẩn",
        "back": "Quay lại",
        "read_time": "Đọc 5 phút",
        "author": "Tác giả"
    },
    "dashboard": {
        "title": "Quản lý Bài viết & Tin tức",
        "subtitle": "Viết blog, thông báo tin tức hoặc tường thuật Lịch sử Sự kiện Dojo.",
        "create": "Tạo Bài viết",
        "empty": "Chưa có bài viết nào",
        "empty_desc": "Dojo của bạn chưa xuất bản tin tức, bài tường thuật hay thông báo nào.",
        "start_writing": "Bắt đầu viết Blog",
        "published": "Đã xuất bản",
        "draft": "Bản nháp",
        "event_linked": "Liên kết với Sự kiện",
        "no_summary": "Không có nội dung mô tả...",
        "edit": "Sửa",
        "delete": "Xóa",
        "confirm_delete": "Bạn có chắc chắn muốn xóa bài viết này không? Không thể khôi phục sau khi xóa.",
        "delete_failed": "Xóa bài viết thất bại.",
        "delete_error": "Đã xảy ra lỗi khi xóa"
    },
    "modal": {
        "create_title": "Tạo Mới Bài Viết",
        "edit_title": "Sửa Bài Viết",
        "title_label": "Tiêu đề",
        "title_placeholder": "Nhập tiêu đề...",
        "summary_label": "Mô tả ngắn gọn (Summary)",
        "summary_placeholder": "Mô tả sẽ hiển thị ở thẻ bài viết trang chủ...",
        "thumbnail_label": "Hình ảnh Thumbnail (URL)",
        "status_label": "Trạng thái xuất bản",
        "status_published": "Công khai (Published)",
        "status_draft": "Bản nháp (Draft)",
        "event_id_label": "ID Sự kiện liên kết (Tùy chọn)",
        "event_id_placeholder": "Paste ID Sự kiện...",
        "content_label": "Nội dung Bài viết",
        "cancel": "Hủy",
        "save": "Cập nhật Bài viết",
        "publish": "Đăng bài",
        "error_required": "Vui lòng nhập tối thiểu Tiêu đề và Nội dung bài viết",
        "error_failed": "Lưu bài viết thất bại"
    },
    "editor": {
        "image_url_prompt": "URL hình ảnh:",
        "link_url_prompt": "URL liên kết:",
        "bold": "In đậm",
        "italic": "In nghiêng",
        "h1": "Tiêu đề 1",
        "h2": "Tiêu đề 2",
        "bullet_list": "Danh sách",
        "ordered_list": "Danh sách số",
        "quote": "Trích dẫn",
        "link": "Chèn liên kết",
        "image": "Chèn ảnh (URL)",
        "undo": "Hoàn tác",
        "redo": "Làm lại"
    }
};

const blogEn = {
    "public": {
        "title": "News & Stories",
        "description": "Stay updated with the latest news, insightful articles, and event reports from our dojo.",
        "empty": "No articles yet",
        "empty_desc": "Our authors are currently working on new content. Please check back later!",
        "event_badge": "Event",
        "read_more": "Read more",
        "back_to_list": "Back to Blogs",
        "not_found": "Article not found or hidden",
        "back": "Go back",
        "read_time": "5 min read",
        "author": "Author"
    },
    "dashboard": {
        "title": "Manage Blogs & News",
        "subtitle": "Write blogs, announcements, or event reports for your Dojo.",
        "create": "Create Blog",
        "empty": "No articles yet",
        "empty_desc": "Your dojo hasn't published any news or reports yet.",
        "start_writing": "Start writing",
        "published": "Published",
        "draft": "Draft",
        "event_linked": "Event Linked",
        "no_summary": "No description available...",
        "edit": "Edit",
        "delete": "Delete",
        "confirm_delete": "Are you sure you want to delete this article? This action cannot be undone.",
        "delete_failed": "Failed to delete the article.",
        "delete_error": "An error occurred while deleting"
    },
    "modal": {
        "create_title": "Create New Article",
        "edit_title": "Edit Article",
        "title_label": "Title",
        "title_placeholder": "Enter title...",
        "summary_label": "Short Summary",
        "summary_placeholder": "Summary displayed on the blog card...",
        "thumbnail_label": "Thumbnail Image (URL)",
        "status_label": "Publication Status",
        "status_published": "Published",
        "status_draft": "Draft",
        "event_id_label": "Linked Event ID (Optional)",
        "event_id_placeholder": "Paste Event ID...",
        "content_label": "Article Content",
        "cancel": "Cancel",
        "save": "Update Article",
        "publish": "Publish",
        "error_required": "Please provide at least a Title and Content",
        "error_failed": "Failed to save the article"
    },
    "editor": {
        "image_url_prompt": "Image URL:",
        "link_url_prompt": "Link URL:",
        "bold": "Bold",
        "italic": "Italic",
        "h1": "Heading 1",
        "h2": "Heading 2",
        "bullet_list": "Bullet List",
        "ordered_list": "Numbered List",
        "quote": "Blockquote",
        "link": "Insert Link",
        "image": "Insert Image (URL)",
        "undo": "Undo",
        "redo": "Redo"
    }
};

viData.blogs = blogVi;
enData.blogs = blogEn;

// Add missed keys in events section for EventModal
viData.events.related_blogs = "Bài viết liên quan";
viData.events.write_new_blog = "Viết bài mới";
viData.events.no_related_blogs = "Chưa có bài viết nào liên kết với sự kiện này.";

enData.events.related_blogs = "Related Articles";
enData.events.write_new_blog = "Write new article";
enData.events.no_related_blogs = "No articles linked to this event yet.";

fs.writeFileSync(viPath, JSON.stringify(viData, null, 2) + '\\n');
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\\n');

console.log('Successfully updated locales!');
