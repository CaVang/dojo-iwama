-- =============================================
-- SUPABASE DATA SEED
-- Copy and run in Supabase SQL Editor
-- =============================================


-- Insert Dojos
INSERT INTO public.dojos (id, name, chief_instructor, address, lat, lng, map_link, phone, email, image_url, description, status)
VALUES
(
      'iwama-honbu',
      'Iwama Shin-Shin Aiki Shuren-kai Honbu Dojo',
      'Hitohira Saito Sensei',
      '2289-1 Yoshioka, Iwama-machi, Kasama-shi, Ibaraki-ken 319-0203, Japan',
      36.3583,
      140.2864,
      'https://maps.google.com/?q=36.3583,140.2864',
      '+81-299-45-2224',
      'info@iwamaaikido.com',
      '/images/dojos/iwama-honbu.jpg',
      'The birthplace of Iwama style Aikido, where O-Sensei spent his later years developing the art in harmony with nature.',
      'approved'
    ),
(
      'tanrenkan-california',
      'Tanrenkan Dojo - California',
      'Miles Kessler Sensei',
      '1234 Aikido Way, San Francisco, CA 94102, USA',
      37.7749,
      -122.4194,
      'https://maps.google.com/?q=37.7749,-122.4194',
      '+1-415-555-0123',
      'info@tanrenkan-ca.org',
      '/images/dojos/tanrenkan-ca.jpg',
      'A traditional Iwama dojo bringing authentic teachings to the West Coast of America.',
      'approved'
    ),
(
      'takemusu-paris',
      'Takemusu Aiki Paris',
      'Daniel Toutain Sensei',
      '45 Rue de la Paix, 75002 Paris, France',
      48.8566,
      2.3522,
      'https://maps.google.com/?q=48.8566,2.3522',
      '+33-1-42-65-1234',
      'contact@takemusu-paris.fr',
      '/images/dojos/takemusu-paris.jpg',
      'One of the premier Iwama Aikido dojos in Europe, dedicated to preserving the founder''s teachings.',
      'approved'
    ),
(
      'iwama-sweden',
      'Iwama Ryu Sweden',
      'Ulf Evenas Sensei',
      'Drottninggatan 12, 111 51 Stockholm, Sweden',
      59.3293,
      18.0686,
      'https://maps.google.com/?q=59.3293,18.0686',
      '+46-8-555-1234',
      'info@iwama-sweden.se',
      '/images/dojos/iwama-sweden.jpg',
      'Bringing the spirit of Iwama to Scandinavia through dedicated practice and teaching.',
      'approved'
    ),
(
      'aiki-shuren-australia',
      'Aiki Shuren Dojo Melbourne',
      'Tony Smibert Sensei',
      '78 Collins Street, Melbourne VIC 3000, Australia',
      -37.8136,
      144.9631,
      'https://maps.google.com/?q=-37.8136,144.9631',
      '+61-3-9555-1234',
      'info@aikishuren-melbourne.com.au',
      '/images/dojos/aiki-shuren-australia.jpg',
      'Australia''s leading Iwama style dojo, fostering the next generation of aikidoka.',
      'approved'
    ),
(
      'takemusu-germany',
      'Takemusu Aikido Berlin',
      'Stefan Stenudd Sensei',
      'Unter den Linden 77, 10117 Berlin, Germany',
      52.52,
      13.405,
      'https://maps.google.com/?q=52.5200,13.4050',
      '+49-30-555-1234',
      'info@takemusu-berlin.de',
      '/images/dojos/takemusu-berlin.jpg',
      'A center of excellence for traditional Iwama Aikido in the heart of Europe.',
      'approved'
    )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  chief_instructor = EXCLUDED.chief_instructor,
  address = EXCLUDED.address,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  map_link = EXCLUDED.map_link,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description;


-- Insert Techniques
INSERT INTO public.techniques (id, slug, name_jp, name_en, category, subcategory, difficulty, description, variants, content)
VALUES
(
      'tai-no-henko',
      'tai-no-henko',
      '体の変更',
      'Body Change',
      'Taijutsu',
      'Warm-up',
      'Beginner',
      'Xoay người đổi hướng - kỹ thuật khởi động bắt buộc trong mọi lớp học Iwama để rèn luyện sự hòa hợp (ki) và hông (koshi).',
      '["Kihon (Cứng, nắm chặt)","Ki no Nagare (Dòng chảy, mềm)"]',
      '{"key_postures":[{"title":"Kamae","description":"Đứng ở tư thế hanmi, đối diện đối thủ. Giữ trọng tâm thấp và ổn định."},{"title":"Nhận nắm tay","description":"Đối thủ nắm cổ tay bạn. Trong Kihon, họ nắm chặt cứng."},{"title":"Tenkan","description":"Xoay người 180 độ, chân sau bước vòng cung phía sau, dẫn đối thủ theo hướng xoay."}],"important_notes":[{"note":"Giữ trọng tâm thấp trong suốt quá trình xoay."},{"note":"Không dùng sức tay, mà dùng hông để dẫn."},{"note":"Ki no Nagare thực hiện khi đối thủ vừa chạm tay, không đợi nắm chặt."}]}'
    ),
(
      'morotedori-kokyuho',
      'morotedori-kokyuho',
      '諸手取り呼吸法',
      'Two-Hand Grab Breath Power',
      'Taijutsu',
      'Warm-up',
      'Beginner',
      'Phương pháp hô hấp khi bị nắm 2 tay vào 1 tay - bài tập ném đối thủ bằng lực hông và hơi thở.',
      '[]',
      '{"key_postures":[{"title":"Bị nắm","description":"Đối thủ dùng hai tay nắm chặt một cổ tay của bạn."},{"title":"Mở rộng","description":"Dùng lực từ hông và hara (bụng dưới), mở rộng cánh tay theo hướng lên trên hoặc ra ngoài."},{"title":"Ném","description":"Tiếp tục mở rộng để phá vỡ thăng bằng đối thủ và ném họ xuống."}],"important_notes":[{"note":"Phối hợp hơi thở: hít vào khi chuẩn bị, thở ra khi mở rộng."},{"note":"Không dùng sức vai, sức phải đến từ hông."}]}'
    ),
(
      'ikkyo',
      'ikkyo',
      '一教',
      'First Teaching (Arm Pin)',
      'Taijutsu',
      'Osae Waza',
      'Beginner',
      'Khóa số 1 (Ude Osae) - Kỹ thuật đè cùi chỏ, là nền tảng cơ bản nhất trong Aikido. Dạy nguyên lý kiểm soát trung tâm đối thủ thông qua điều khiển cánh tay.',
      '[]',
      '{"key_postures":[{"title":"Ai-hanmi Kamae","description":"Bắt đầu ở tư thế cùng chiều với đối thủ. Giữ khoảng cách phù hợp (ma-ai)."},{"title":"Irimi Entry","description":"Khi đối thủ tấn công, hòa nhập bằng cách đi sâu bên cạnh cánh tay họ. Tay trước nắm khuỷu tay, tay sau hướng dẫn cổ tay."},{"title":"Osae (Pin)","description":"Dẫn đối thủ xuống thảm theo chuyển động xoắn ốc. Cuối cùng đối thủ nằm úp, cánh tay duỗi thẳng, khuỷu tay và vai bị khóa."}],"important_notes":[{"note":"Không bao giờ dùng lực chống lực. Ikkyo hoạt động nhờ thời điểm và góc độ đúng."},{"note":"Giữ trung tâm của bạn kết nối với trung tâm đối thủ trong suốt kỹ thuật."},{"note":"Chuyển động cắt phải bắt nguồn từ hông, không phải từ tay (tegatana)."}]}'
    ),
(
      'nikyo',
      'nikyo',
      '二教',
      'Second Teaching (Wrist Turn)',
      'Taijutsu',
      'Osae Waza',
      'Beginner',
      'Khóa số 2 (Kote Mawashi) - Xoắn cổ tay vào trong. Phát triển sự nhạy cảm với áp lực và góc độ trong khi duy trì kết nối.',
      '[]',
      '{"key_postures":[{"title":"Nắm cổ tay","description":"Sau khi hòa nhập với tấn công, nắm cổ tay đối thủ theo kiểu C-grip. Ngón cái ở mu bàn tay, các ngón quấn quanh cổ tay."},{"title":"Xoay cổ tay","description":"Xoay cổ tay đối thủ vào trong trong khi kiểm soát khuỷu tay. Chuyển động xoay phải mượt mà và liên tục."},{"title":"Khóa quỳ","description":"Đưa đối thủ xuống bằng khóa cổ tay, chuyển sang tư thế quỳ. Khóa cuối cùng giữ cả cổ tay và khuỷu tay."}],"important_notes":[{"note":"Hiệu quả của Nikyo đến từ góc độ chính xác, không phải lực nghiền. Tìm đúng góc và kỹ thuật không cần nhiều sức."},{"note":"Luôn kiểm soát khuỷu tay đối thủ. Không có kiểm soát khuỷu tay, đối thủ có thể thoát khóa cổ tay."}]}'
    ),
(
      'sankyo',
      'sankyo',
      '三教',
      'Third Teaching (Wrist Twist)',
      'Taijutsu',
      'Osae Waza',
      'Intermediate',
      'Khóa số 3 (Kote Hineri) - Xoắn cổ tay lên trên theo hình xoắn ốc qua toàn bộ cánh tay đến vai. Thể hiện bản chất xoắn ốc của chuyển động Aikido.',
      '[]',
      '{"key_postures":[{"title":"Bắt tay","description":"Bắt tay đối thủ bằng cả hai tay, tạo cấu trúc với các ngón tay quấn trên bàn tay họ và ngón cái ấn vào lòng bàn tay."},{"title":"Xoắn ốc","description":"Xoay tay đối thủ theo chuyển động xoắn ốc về phía đường trung tâm của họ. Khuỷu tay sẽ nâng lên khi xoay tiếp tục."},{"title":"Kiểm soát đứng","description":"Duy trì khóa trong khi chuyển đến các vị trí khác nhau. Sankyo có thể dẫn đến ném hoặc khóa tùy tình huống."}],"important_notes":[{"note":"Xoắn ốc phải liên tục và kết nối với chuyển động trung tâm của bạn."},{"note":"Cẩn thận không xoay quá mức gây chấn thương cổ tay. Áp dụng khóa mượt mà và cho đối thủ thời gian tap."}]}'
    ),
(
      'yonkyo',
      'yonkyo',
      '四教',
      'Fourth Teaching (Wrist Press)',
      'Taijutsu',
      'Osae Waza',
      'Intermediate',
      'Khóa số 4 (Tekubi Osae) - Bấm huyệt cổ tay. Sử dụng áp lực lên dây thần kinh ở mặt trong cẳng tay để kiểm soát đối thủ.',
      '[]',
      '{"key_postures":[{"title":"Nắm cẳng tay","description":"Nắm cẳng tay đối thủ với đốt ngón tay trỏ ấn vào điểm huyệt trên mặt trong cẳng tay."},{"title":"Áp lực điểm huyệt","description":"Áp dụng áp lực bằng đốt ngón tay trong khi giữ Ikkyo-style control trên cánh tay."},{"title":"Dẫn xuống","description":"Dùng áp lực điểm huyệt kết hợp với kiểm soát cánh tay để dẫn đối thủ xuống thảm."}],"important_notes":[{"note":"Điểm huyệt nằm cách cổ tay khoảng 1-2 tấc trên mặt trong cẳng tay."},{"note":"Yonkyo cần luyện tập nhiều để tìm đúng vị trí. Không phải ai cũng nhạy cảm với điểm này."}]}'
    ),
(
      'gokyo',
      'gokyo',
      '五教',
      'Fifth Teaching (Arm Stretch)',
      'Taijutsu',
      'Osae Waza',
      'Advanced',
      'Khóa số 5 (Ude Nobashi) - Tương tự Ikkyo nhưng tay cầm ngược để tước dao. Đặc biệt dùng cho kỹ thuật tanto-dori (tước dao).',
      '[]',
      '{"key_postures":[{"title":"Đối phó tấn công dao","description":"Khi đối thủ tấn công bằng dao, hòa nhập và nắm cổ tay họ với ngón cái hướng xuống (ngược với Ikkyo)."},{"title":"Kiểm soát khuỷu tay","description":"Giữ khuỷu tay đối thủ duỗi thẳng và khóa, ngăn họ có thể cắt bạn."},{"title":"Tước và khóa","description":"Dẫn đối thủ xuống trong khi tước dao khỏi tay họ."}],"important_notes":[{"note":"Cách nắm ngược trong Gokyo giữ lưỡi dao hướng ra xa khỏi bạn."},{"note":"Luôn giữ khuỷu tay đối thủ duỗi thẳng để họ không thể cắt được."}]}'
    ),
(
      'rokkyo',
      'rokkyo',
      '六教',
      'Sixth Teaching (Elbow Lock)',
      'Taijutsu',
      'Osae Waza',
      'Advanced',
      'Khóa số 6 (Hiji Kime Osae) - Khóa khớp khuỷu tay. Kỹ thuật khóa nâng cao tập trung vào việc cố định khuỷu tay.',
      '[]',
      '{"key_postures":[{"title":"Nắm cánh tay","description":"Nắm cánh tay đối thủ với một tay trên cổ tay, tay kia trên khuỷu tay."},{"title":"Khóa khuỷu tay","description":"Ép khuỷu tay đối thủ đưa lên cao trong khi giữ cổ tay thấp, tạo áp lực lên khớp khuỷu tay."},{"title":"Hoàn thành khóa","description":"Dẫn đối thủ xuống thảm với khuỷu tay bị khóa."}],"important_notes":[{"note":"Cẩn thận khi áp dụng vì kỹ thuật này có thể gây chấn thương khuỷu tay nếu dùng quá mạnh."},{"note":"Rokkyo ít phổ biến hơn các khóa khác nhưng rất hiệu quả trong một số tình huống."}]}'
    ),
(
      'shihonage',
      'shihonage',
      '四方投げ',
      'Four Directions Throw',
      'Taijutsu',
      'Nage Waza',
      'Intermediate',
      'Ném 4 phương - Đặc sản Iwama: giữ tay chặt như cầm kiếm trước ngực. Kỹ thuật ném có thể đưa đối thủ theo bất kỳ hướng nào trong 4 hướng chính.',
      '[]',
      '{"key_postures":[{"title":"Katate-dori Grasp","description":"Từ nắm tay cùng phía, hòa nhập với năng lượng đối thủ trong khi nắm chặt cổ tay họ bằng cả hai tay."},{"title":"Tenkan Pivot","description":"Thực hiện xoay 180 độ trong khi nâng cánh tay đối thủ qua đầu. Chuyển động của bạn phải ở dưới cánh tay đối thủ."},{"title":"Hoàn thành ném","description":"Hoàn thành ném bằng cách cắt xuống với cánh tay đối thủ trong khi bước qua. Đối thủ ngã ngửa ra sau."}],"important_notes":[{"note":"Đặc biệt trong Iwama: giữ tay như đang cầm kiếm trước ngực."},{"note":"Xoay phải đưa bạn hoàn toàn dưới cánh tay đối thủ. Xoay một phần dẫn đến kỹ thuật yếu hoặc nguy hiểm."},{"note":"Ném đến từ xoay hông, không phải từ kéo cánh tay."}]}'
    ),
(
      'iriminage',
      'iriminage',
      '入り身投げ',
      'Entering Throw',
      'Taijutsu',
      'Nage Waza',
      'Intermediate',
      'Ném nhập nội - Đi vào ''điểm chết'' sau gáy đối thủ. Kỹ thuật thể hiện nguyên lý irimi - di chuyển trực tiếp vào và xuyên qua tấn công.',
      '[]',
      '{"key_postures":[{"title":"Nhập nội ban đầu","description":"Đi sâu qua tấn công của đối thủ, đặt mình bên cạnh họ với hông kết nối với trung tâm của họ."},{"title":"Vẽ xoắn ốc","description":"Kéo thăng bằng đối thủ theo chuyển động tròn, hạ thấp trung tâm của họ trong khi duy trì kết nối qua cánh tay và thân."},{"title":"Ném cuối cùng","description":"Hoàn thành ném bằng cách nhập nội lần nữa trong khi cánh tay bạn dẫn đầu và cổ đối thủ ra sau."}],"important_notes":[{"note":"Irimi thực sự đòi hỏi cam kết hoàn toàn. Nhập nội nửa vời để bạn dễ bị phản công."},{"note":"Ném phải cảm thấy như một con sóng - đối thủ bị kéo vào, sau đó bị đẩy ra."}]}'
    ),
(
      'kotegaeshi',
      'kotegaeshi',
      '小手返し',
      'Wrist Return Throw',
      'Taijutsu',
      'Nage Waza',
      'Intermediate',
      'Ném lật cổ tay - Kỹ thuật ném bằng cách lật ngược cổ tay đối thủ, tạo áp lực lên khớp cổ tay và phá vỡ thăng bằng.',
      '[]',
      '{"key_postures":[{"title":"Nắm cổ tay","description":"Nắm cổ tay đối thủ với một tay trên mu bàn tay, tay kia hỗ trợ từ bên dưới."},{"title":"Lật cổ tay","description":"Lật cổ tay đối thủ ra ngoài và xuống dưới, hướng về phía họ."},{"title":"Ném","description":"Tiếp tục chuyển động lật để ném đối thủ xuống. Họ sẽ phải lộn ngược để tránh chấn thương cổ tay."}],"important_notes":[{"note":"Lật cổ tay phải kết hợp với tenkan để tạo động lượng."},{"note":"Không chỉ dùng tay, mà dùng cả cơ thể để tạo lực lật."}]}'
    ),
(
      'kaitennage',
      'kaitennage',
      '回転投げ',
      'Rotation Throw',
      'Taijutsu',
      'Nage Waza',
      'Intermediate',
      'Ném vòng cầu - Có 2 loại: Uchi (luồn trong nách) và Soto (đè ngoài cổ). Kỹ thuật ném xoay vòng đặc trưng.',
      '["Uchi Kaiten-nage (luồn trong nách)","Soto Kaiten-nage (đè ngoài cổ)"]',
      '{"key_postures":[{"title":"Nắm và dẫn","description":"Nắm cánh tay đối thủ và dẫn họ theo vòng cung."},{"title":"Xoay vòng","description":"Uchi: Luồn dưới nách đối thủ. Soto: Ép từ bên ngoài cổ."},{"title":"Hoàn thành ném","description":"Tiếp tục chuyển động xoay để ném đối thủ xuống theo vòng cung."}],"important_notes":[{"note":"Phân biệt rõ Uchi và Soto để áp dụng đúng tình huống."},{"note":"Giữ đối thủ mất thăng bằng trong suốt chuyển động xoay."}]}'
    ),
(
      'tenchinage',
      'tenchinage',
      '天地投げ',
      'Heaven and Earth Throw',
      'Taijutsu',
      'Nage Waza',
      'Intermediate',
      'Ném trời đất - Kỹ thuật ném bằng cách tách hai tay đối thủ theo hai hướng ngược nhau: trời (lên) và đất (xuống).',
      '[]',
      '{"key_postures":[{"title":"Ryote-dori","description":"Đối thủ nắm cả hai cổ tay của bạn."},{"title":"Tách trời đất","description":"Một tay vươn lên trời (ten), tay kia hướng xuống đất (chi), tạo ra lực tách đối thủ."},{"title":"Nhập nội và ném","description":"Bước vào sâu trong khi duy trì sự tách, phá vỡ thăng bằng và ném đối thủ."}],"important_notes":[{"note":"Hai tay phải di chuyển đồng thời và quyết đoán."},{"note":"Bước irimi phải cùng lúc với việc tách tay."}]}'
    ),
(
      'koshinage',
      'koshinage',
      '腰投げ',
      'Hip Throw',
      'Taijutsu',
      'Nage Waza',
      'Advanced',
      'Ném hông - Iwama có rất nhiều biến thể Koshi-nage. Kỹ thuật ném sử dụng hông làm điểm tựa chính.',
      '[]',
      '{"key_postures":[{"title":"Nhập nội sâu","description":"Đi sâu vào bên cạnh hoặc trước đối thủ, đặt hông của bạn thấp hơn trọng tâm của họ."},{"title":"Nâng lên hông","description":"Sử dụng hông như điểm tựa, nâng đối thủ lên."},{"title":"Ném qua hông","description":"Xoay và hạ thấp để ném đối thủ qua hông của bạn."}],"important_notes":[{"note":"Iwama có nhiều biến thể Koshi-nage khác nhau tùy theo cách tấn công."},{"note":"Hông phải thấp hơn trọng tâm đối thủ để ném hiệu quả."},{"note":"Cần luyện tập ukemi (lộn) tốt trước khi tập kỹ thuật này."}]}'
    ),
(
      'jujinage',
      'jujinage',
      '十字投げ',
      'Cross Throw',
      'Taijutsu',
      'Nage Waza',
      'Advanced',
      'Ném thập tự (Juji Garami) - Khóa tréo 2 tay của đối thủ thành hình chữ thập rồi ném.',
      '[]',
      '{"key_postures":[{"title":"Nắm hai tay","description":"Từ ryote-dori hoặc tình huống tương tự, kiểm soát cả hai cổ tay đối thủ."},{"title":"Tréo tay","description":"Dẫn hai tay đối thủ tréo nhau thành hình chữ thập (十)."},{"title":"Ném","description":"Sử dụng cấu trúc tréo để phá vỡ thăng bằng và ném đối thủ."}],"important_notes":[{"note":"Giữ hai tay đối thủ tréo chặt để họ không thể thoát."},{"note":"Ném phải đến từ chuyển động cơ thể, không phải lực tay."}]}'
    ),
(
      'kokyunage',
      'kokyunage',
      '呼吸投げ',
      'Breath Throw',
      'Taijutsu',
      'Nage Waza',
      'Advanced',
      'Ném bằng lực hô hấp - Đây là nhóm đòn rộng nhất, không có khuôn mẫu cố định, tùy biến hóa. Ném bằng kokyu-ryoku (sức mạnh hô hấp).',
      '[]',
      '{"key_postures":[{"title":"Tiếp nhận tấn công","description":"Hòa nhập với bất kỳ loại tấn công nào từ đối thủ."},{"title":"Hướng dẫn năng lượng","description":"Sử dụng kokyu (hô hấp/năng lượng) để dẫn năng lượng đối thủ."},{"title":"Ném tự nhiên","description":"Ném đối thủ theo hướng năng lượng của họ đang đi, không cần kỹ thuật khóa cố định."}],"important_notes":[{"note":"Kokyu-nage là nhóm kỹ thuật rộng nhất, bao gồm mọi ném không thuộc các loại khác."},{"note":"Không có khuôn mẫu cố định - đòi hỏi sự nhạy cảm và linh hoạt cao."},{"note":"Thể hiện sự thành thạo cao khi có thể ném mượt mà mà không cần dùng lực."}]}'
    ),
(
      'kokyu-ho',
      'kokyu-ho',
      '呼吸法',
      'Breath Power Exercise',
      'Taijutsu',
      'Warm-up',
      'Beginner',
      'Bài tập sức mạnh hô hấp ngồi. Thường thực hiện cuối mỗi buổi tập để rèn luyện kokyu-ryoku.',
      '[]',
      '{"key_postures":[{"title":"Seiza","description":"Cả hai ngồi seiza đối diện nhau. Đối thủ nắm chặt cả hai cổ tay của bạn."},{"title":"Mở rộng","description":"Mở rộng cánh tay về phía trước và lên trên trong khi giữ vai thả lỏng. Sức mạnh đến từ hara (bụng dưới)."},{"title":"Đẩy ngã","description":"Tiếp tục mở rộng để phá vỡ thăng bằng đối thủ và đẩy họ ngã về phía sau."}],"important_notes":[{"note":"Thả lỏng vai hoàn toàn. Căng thẳng ngăn dòng chảy sức mạnh từ trung tâm."},{"note":"Thở tự nhiên trong suốt quá trình. Nín thở tạo ra cứng nhắc và yếu đuối."}]}'
    ),
(
      'suburi-ichi',
      'suburi-ichi',
      '素振り一',
      'First Sword Swing',
      'Aiki-Ken',
      NULL,
      'Beginner',
      'Vung kiếm đầu tiên và cơ bản nhất trong Aiki-ken. Bài tập này phát triển hình thức cắt đúng, phối hợp hơi thở, và chuyển động trung tâm.',
      '[]',
      '{"key_postures":[{"title":"Chudan Kamae","description":"Bắt đầu ở tư thế trung đẳng với mũi kiếm ở độ cao cổ họng. Nắm tay thả lỏng nhưng chắc chắn."},{"title":"Nâng (Furikaburi)","description":"Nâng kiếm lên trên đầu theo vòng cung lớn. Mũi kiếm đi qua đường trung tâm của bạn."},{"title":"Cắt (Kirioroshi)","description":"Thực hiện cắt xuống bằng cách hạ trung tâm và để trọng lực hỗ trợ. Dừng với mũi kiếm ở độ cao đầu gối."}],"important_notes":[{"note":"Cắt phải đến từ trung tâm, không phải từ tay. Cơ thể bạn hạ xuống, kiếm theo sau."},{"note":"Phối hợp hơi thở: hít vào khi nâng, thở ra khi cắt."}]}'
    ),
(
      'kumitachi-ichi',
      'kumitachi-ichi',
      '組太刀一',
      'First Paired Sword',
      'Aiki-Ken',
      NULL,
      'Intermediate',
      'Kata kiếm đôi đầu tiên trong Iwama Aiki-ken. Bài tập này phát triển thời điểm, khoảng cách, và khả năng đọc ý định đối thủ.',
      '[]',
      '{"key_postures":[{"title":"Vị trí mở đầu","description":"Cả hai đối tác bắt đầu ở chudan kamae với khoảng cách phù hợp (issoku itto no ma)."},{"title":"Tấn công và phản ứng","description":"Uchitachi khởi đầu với shomen cut. Uketachi đón nhận bằng cách nâng kiếm và hòa nhập với năng lượng đến."},{"title":"Phản công và kết thúc","description":"Uketachi hoàn thành kata với đòn phản công quyết đoán trong khi uchitachi chấp nhận kỹ thuật."}],"important_notes":[{"note":"Vai trò của uchitachi là cung cấp tấn công chân thành để phát triển khả năng của uketachi."},{"note":"Kata nên chảy tự nhiên khi đã học. Do dự hoặc vội vàng đều cho thấy cần cải thiện."}]}'
    ),
(
      'jo-suburi-ichi',
      'jo-suburi-ichi',
      '杖素振り一',
      'First Staff Swing',
      'Aiki-Jo',
      NULL,
      'Beginner',
      'Bài tập vung gậy đầu tiên. Luyện tập Jo trong phong cách Iwama phát triển chuyển động tròn, phối hợp hai tay, và dòng chảy năng lượng.',
      '[]',
      '{"key_postures":[{"title":"Choku-tsuki Kamae","description":"Giữ jo với cả hai tay, tay sau gần cuối, tay trước khoảng 1/3 từ đầu. Jo chỉ vào cổ họng đối thủ."},{"title":"Chuẩn bị đâm","description":"Kéo jo về phía sau theo đường trung tâm trong khi chuyển trọng lượng về chân sau. Jo giữ ngang."},{"title":"Thực hiện đâm","description":"Đẩy về phía trước với chân sau trong khi duỗi jo thành đường đâm thẳng. Sức mạnh đến từ hông."}],"important_notes":[{"note":"Đâm và bước chân phải thống nhất. Đến trước hoặc sau vũ khí đều tạo ra lỗ hổng."},{"note":"Nhận thức toàn bộ chiều dài jo. Đầu sau cũng là một vũ khí."}]}'
    ),
(
      'thirty-one-jo-kata',
      'thirty-one-jo-kata',
      '三十一の杖',
      '31 Jo Kata',
      'Aiki-Jo',
      NULL,
      'Advanced',
      'Kata jo nền tảng của Iwama Aikido, gồm 31 động tác. Kata này thể hiện nguyên lý Riai - sự tích hợp của jo, ken, và taijutsu.',
      '[]',
      '{"key_postures":[{"title":"Chuỗi mở đầu","description":"Kata bắt đầu với choku-tsuki tiếp theo là một loạt đòn đánh và đâm thiết lập nhịp điệu."},{"title":"Phần giữa","description":"Phần giữa bao gồm các tổ hợp phức tạp hơn bao gồm kaeshi-tsuki (đâm quay lại) và các mẫu đánh khác nhau."},{"title":"Chuỗi kết thúc","description":"Kata kết thúc với các động tác quyết đoán thể hiện tất cả các nguyên lý đã luyện tập, kết thúc với zanshin phù hợp."}],"important_notes":[{"note":"Học từng động tác riêng lẻ trước khi cố gắng chảy qua toàn bộ kata. Chất lượng hơn tốc độ."},{"note":"Mỗi động tác trong kata đều có ứng dụng võ thuật. Luyện tập với nhận thức về đối thủ tưởng tượng."},{"note":"31 Jo Kata nên được luyện tập cả đơn và với 31 Kumijo (luyện tập đôi) để hiểu đầy đủ các ứng dụng."}]}'
    ),
(
      'tachi-dori',
      'tachi-dori',
      '太刀取り',
      'Sword Taking',
      'Buki-dori',
      NULL,
      'Advanced',
      'Tay không đoạt kiếm - Kỹ thuật sử dụng taijutsu để tước kiếm từ đối thủ có vũ trang.',
      '[]',
      '{"key_postures":[{"title":"Đối mặt kiếm","description":"Đối thủ tấn công bằng kiếm. Bạn di chuyển để tránh đòn cắt."},{"title":"Nhập nội và kiểm soát","description":"Đi vào khoảng cách nguy hiểm và kiểm soát cánh tay cầm kiếm của đối thủ."},{"title":"Tước kiếm","description":"Áp dụng kỹ thuật khóa hoặc ném đồng thời tước kiếm khỏi tay đối thủ."}],"important_notes":[{"note":"Thời điểm và irimi là yếu tố sống còn khi đối mặt với vũ khí."},{"note":"Luyện tập với kiếm gỗ (bokken) để đảm bảo an toàn."}]}'
    ),
(
      'jo-dori',
      'jo-dori',
      '杖取り',
      'Staff Taking',
      'Buki-dori',
      NULL,
      'Advanced',
      'Tay không đoạt gậy - Kỹ thuật sử dụng taijutsu để tước gậy từ đối thủ có vũ trang.',
      '[]',
      '{"key_postures":[{"title":"Đối mặt gậy","description":"Đối thủ tấn công bằng jo. Bạn di chuyển để tránh đòn đánh hoặc đâm."},{"title":"Nhập nội","description":"Đi vào bên trong tầm với của gậy và kiểm soát đối thủ."},{"title":"Tước gậy","description":"Áp dụng kỹ thuật để tước gậy hoặc ném đối thủ."}],"important_notes":[{"note":"Jo có tầm với dài, cần nhập nội quyết đoán."},{"note":"Cẩn thận cả hai đầu gậy đều là vũ khí."}]}'
    ),
(
      'tanto-dori',
      'tanto-dori',
      '短刀取り',
      'Knife Taking',
      'Buki-dori',
      NULL,
      'Advanced',
      'Tay không đoạt dao - Kỹ thuật sử dụng taijutsu để tước dao từ đối thủ có vũ trang. Thường sử dụng Gokyo.',
      '[]',
      '{"key_postures":[{"title":"Đối mặt dao","description":"Đối thủ tấn công bằng dao. Đây là tình huống nguy hiểm nhất."},{"title":"Tránh và kiểm soát","description":"Tránh đường đâm/cắt và ngay lập tức kiểm soát cánh tay cầm dao."},{"title":"Tước dao (Gokyo)","description":"Áp dụng Gokyo hoặc kỹ thuật tương tự với cách nắm ngược để tước dao an toàn."}],"important_notes":[{"note":"Trong Gokyo, cách nắm ngược giữ lưỡi dao hướng ra xa khỏi bạn."},{"note":"Luôn giữ khuỷu tay đối thủ duỗi thẳng để họ không thể cắt được."},{"note":"Tanto-dori đòi hỏi sự tập trung và chính xác cao nhất."}]}'
    ),
(
      'jo-nage',
      'jo-nage',
      '杖投げ',
      'Staff Throw',
      'Buki-dori',
      NULL,
      'Advanced',
      'Dùng gậy để ném đối thủ - Kỹ thuật sử dụng jo như một công cụ để khóa và ném đối thủ tay không hoặc có vũ khí.',
      '[]',
      '{"key_postures":[{"title":"Cầm jo","description":"Bạn đang cầm jo, đối thủ tấn công bạn (có thể tay không hoặc có vũ khí)."},{"title":"Sử dụng jo để kiểm soát","description":"Sử dụng jo để chặn, đánh, hoặc khóa đối thủ."},{"title":"Ném bằng jo","description":"Sử dụng jo như đòn bẩy hoặc điểm kiểm soát để ném đối thủ."}],"important_notes":[{"note":"Jo-nage khác với Jo-dori - ở đây BẠN là người cầm gậy."},{"note":"Jo có thể được sử dụng theo nhiều cách: đánh, đâm, khóa, hoặc làm đòn bẩy."}]}'
    )
ON CONFLICT (id) DO UPDATE SET
  name_jp = EXCLUDED.name_jp,
  name_en = EXCLUDED.name_en,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  difficulty = EXCLUDED.difficulty,
  description = EXCLUDED.description,
  variants = EXCLUDED.variants,
  content = EXCLUDED.content,
  updated_at = NOW();


-- Insert Events
INSERT INTO public.events (id, title_key, date, end_date, dojo_id, description_key, image_url, event_type, instructor, related_blog_ids)
VALUES
(
      'winter-gasshuku-2026',
      'winterGasshuku2026',
      '2026-02-15',
      '2026-02-17',
      'iwama-honbu',
      'winterGasshuku2026Desc',
      '/images/events/gasshuku-winter.jpg',
      'gasshuku',
      'Hitohira Saito Sensei',
      '[]'
    ),
(
      'weapons-seminar-feb',
      'weaponsSeminarFeb',
      '2026-02-22',
      NULL,
      'takemusu-paris',
      'weaponsSeminarFebDesc',
      '/images/events/weapons-seminar.jpg',
      'seminar',
      'Daniel Toutain Sensei',
      '[]'
    ),
(
      'spring-gasshuku-2026',
      'springGasshuku2026',
      '2026-03-20',
      '2026-03-23',
      'tanrenkan-california',
      'springGasshuku2026Desc',
      '/images/events/gasshuku-spring.jpg',
      'gasshuku',
      'Miles Kessler Sensei',
      '[]'
    ),
(
      'beginner-workshop-mar',
      'beginnerWorkshopMar',
      '2026-03-08',
      NULL,
      'iwama-sweden',
      'beginnerWorkshopMarDesc',
      '/images/events/beginner-workshop.jpg',
      'workshop',
      'Ulf Evenas Sensei',
      '[]'
    ),
(
      'dan-examination-apr',
      'danExaminationApr',
      '2026-04-12',
      NULL,
      'iwama-honbu',
      'danExaminationAprDesc',
      '/images/events/dan-exam.jpg',
      'examination',
      'Hitohira Saito Sensei',
      '[]'
    ),
(
      'summer-intensive-2026',
      'summerIntensive2026',
      '2026-07-15',
      '2026-07-25',
      'iwama-honbu',
      'summerIntensive2026Desc',
      '/images/events/summer-intensive.jpg',
      'gasshuku',
      'Hitohira Saito Sensei',
      '[]'
    )
ON CONFLICT (id) DO UPDATE SET
  title_key = EXCLUDED.title_key,
  date = EXCLUDED.date,
  end_date = EXCLUDED.end_date,
  dojo_id = EXCLUDED.dojo_id,
  description_key = EXCLUDED.description_key,
  image_url = EXCLUDED.image_url,
  event_type = EXCLUDED.event_type,
  instructor = EXCLUDED.instructor,
  related_blog_ids = EXCLUDED.related_blog_ids;

