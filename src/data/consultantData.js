import { majorGroups } from './majorGroups';

export const phase1Questions = [
    {
        id: 'favorite_subjects',
        title: 'Trong suốt quá trình học, những môn học nào khiến bạn cảm thấy hào hứng và muốn đào sâu nhất? (Chọn nhiều môn)',
        type: 'multiple',
        options: [
            { label: 'Toán học (Tư duy logic, con số)', value: 'math', weight: { 'group-48': 3, 'group-engineering': 3, 'group-46': 5, 'group-34': 2 } },
            { label: 'Vật lý (Quy luật tự nhiên, máy móc)', value: 'physics', weight: { 'group-engineering': 5, 'group-48': 3, 'group-44': 4, 'group-58': 3 } },
            { label: 'Hóa học (Phản ứng, cấu tạo vật chất)', value: 'chemistry', weight: { 'group-44': 5, 'group-72': 4, 'group-54': 4, 'group-42': 3 } },
            { label: 'Sinh học (Sự sống, cơ thể, môi trường)', value: 'biology', weight: { 'group-72': 5, 'group-42': 5, 'group-64': 5, 'group-62': 4 } },
            { label: 'Ngữ văn (Cảm xúc, ngôn từ, cốt truyện)', value: 'literature', weight: { 'group-22': 5, 'group-32': 4, 'group-14': 4, 'group-38': 3 } },
            { label: 'Ngoại ngữ (Kết nối quốc tế, văn hóa mới)', value: 'english', weight: { 'group-22': 5, 'group-81': 4, 'group-34': 3, 'group-32': 3 } },
            { label: 'Lịch sử - Địa lý (Dòng chảy thời gian, không gian)', value: 'social', weight: { 'group-22': 4, 'group-31': 5, 'group-81': 3 } },
            { label: 'Tin học (Công nghệ, thế giới ảo)', value: 'it', weight: { 'group-48': 5, 'group-engineering': 2 } },
            { label: 'Mỹ thuật - Âm nhạc (Sáng tạo, thẩm mỹ)', value: 'art', weight: { 'group-21': 5, 'group-58': 2 } },
            { label: 'Giáo dục công dân (Chuẩn mực, đạo đức, xã hội)', value: 'civic', weight: { 'group-38': 5, 'group-86': 4 } }
        ]
    },
    {
        id: 'working_style',
        title: 'Khi đối mặt với một nhiệm vụ mới, phong cách tự nhiên của bạn thường là?',
        type: 'single',
        options: [
            { label: 'Ngồi xuống phân tích rành mạch các bước rồi mới làm', value: 'analyst', weight: { 'group-48': 3, 'group-46': 3, 'group-38': 2 } },
            { label: 'Bắt tay vào làm ngay (DIY), vừa làm vừa học từ sai sót', value: 'doer', weight: { 'group-engineering': 3, 'group-54': 3, 'group-21': 2 } },
            { label: 'Tìm kiếm những người khác để cùng thảo luận và phân chia công việc', value: 'collaborator', weight: { 'group-14': 3, 'group-31': 3, 'group-34': 3, 'group-81': 3 } },
            { label: 'Phóng tác, tìm những cách làm khác thường, bay bổng', value: 'creative', weight: { 'group-21': 5, 'group-32': 3, 'group-58': 3 } }
        ]
    },
    {
        id: 'soft_skills',
        title: 'Kỹ năng nào bạn cảm thấy mình sở hữu một cách tự nhiên (không cần quá nỗ lực)?',
        type: 'multiple',
        maxChoices: 3,
        options: [
            { label: 'Lắng nghe và thấu hiểu nỗi đau/vấn đề của người khác', value: 'empathy', weight: { 'group-72': 3, 'group-31': 3, 'group-14': 3 } },
            { label: 'Thuyết phục và gây ảnh hưởng lên đám đông', value: 'influence', weight: { 'group-34': 3, 'group-32': 3, 'group-38': 2 } },
            { label: 'Sắp xếp đồ đạc, dữ liệu cực kỳ ngăn nắp và khoa học', value: 'organization', weight: { 'group-34': 3, 'group-46': 3, 'group-48': 2 } },
            { label: 'Nhìn ra vẻ đẹp ở những thứ bình thường nhất', value: 'aesthetic', weight: { 'group-21': 5, 'group-58': 3 } },
            { label: 'Luôn tìm ra kẽ hở hoặc lỗi sai trong một hệ thống', value: 'checker', weight: { 'group-48': 3, 'group-38': 3, 'group-86': 3 } },
            { label: 'Khả năng quan sát sự thay đổi nhỏ của cây cối, con vật', value: 'observer', weight: { 'group-62': 5, 'group-64': 5, 'group-42': 3 } }
        ]
    },
    {
        id: 'lifestyle_future',
        title: 'Bạn hình dung cuộc sống của mình sau 10 năm nữa sẽ như thế nào?',
        type: 'single',
        options: [
            { label: 'Một chuyên gia bận rộn tại các thành phố lớn, thu nhập cực cao', value: 'city-pro', weight: { 'group-34': 3, 'group-48': 3, 'group-72': 2 } },
            { label: 'Làm việc tự do (Freelance), được đi đây đi đó khắp nơi', value: 'nomad', weight: { 'group-81': 3, 'group-32': 3, 'group-21': 3 } },
            { label: 'Một cuộc sống ổn định, cống hiến giá trị cho cộng đồng/quê hương', value: 'stable', weight: { 'group-14': 4, 'group-38': 3, 'group-86': 3 } },
            { label: 'Làm chủ một cơ sở sản xuất hoặc trang trại hiện đại của riêng mình', value: 'owner', weight: { 'group-62': 5, 'group-54': 4, 'group-64': 4 } }
        ]
    },
    {
        id: 'secret_dream',
        title: 'Hãy chia sẻ về ước mơ thuở nhỏ hoặc một "đam mê thầm kín" mà bạn chưa bao giờ dám thực hiện? (Nhập văn bản)',
        type: 'text',
        placeholder: 'Ví dụ: Tôi muốn trở thành một phi hành gia, hay chỉ đơn giản là muốn xây một ngôi nhà độc đáo cho cha mẹ...'
    }
];

// Phase 2 Templates - Still psychological but themed for the detected group
const questionTemplates = [
    {
        title: 'Khi đứng trước áp lực từ kỳ vọng của gia đình, bạn sẽ phản ứng như thế nào?',
        options: ['Sẵn sàng đối đầu để bảo vệ đam mê đến cùng', 'Cố gắng tìm điểm dung hòa giữa mong muốn của mình và gia đình', 'Tạm thời nghe theo ý gia đình để ổn định nhưng sẽ tìm cách quay lại đam mê sau', 'Chấp nhận thực tế vì gia đình là điểm tựa quan trọng nhất']
    },
    {
        title: 'Trong một trò chơi nhập vai, bạn thường chọn nhân vật nào?',
        options: ['Người tiên phong dẫn đầu (Leader)', 'Người hỗ trợ âm thầm (Support)', 'Người chiến lược tính toán (Strategist)', 'Người thợ chế tạo vũ khí/vật phẩm (Crafter)']
    },
    {
        title: 'Kiểu thất bại nào khiến bạn cảm thấy khó chấp nhận nhất?',
        options: ['Sai sót do sự cẩu thả/thiếu chính xác', 'Thất bại vì bị người khác phản bội/thiếu sự kết nối', 'Thất bại vì ý tưởng quá cũ kỹ, không có gì mới', 'Thất bại vì không có đủ nguồn lực tài chính/thời gian']
    },
    {
        title: 'Bạn cảm thấy mình "thăng hoa" nhất khi được làm việc trong môi trường?',
        options: ['Yên tĩnh tuyệt đối, chỉ có mình và các công cụ nghiên cứu', 'Sôi động, luôn có sự tranh luận và tương tác với đồng nghiệp', 'Ngoài trời, gần gũi với thiên nhiên và sự sống thực tế', 'Nơi có quy chế, trật tự và mọi thứ diễn ra đúng kế hoạch']
    },
    {
        title: 'Nếu thế giới không cần tiền, bạn sẽ dành trọn vẹn 24h mỗi ngày để làm gì?',
        options: ['Chăm sóc và chữa lành cho những người/vật đang chịu đau đớn', 'Nghiên cứu những bí ẩn của vũ trụ/công nghệ', 'Sáng tạo những tác phẩm nghệ thuật/nội dung truyền cảm hứng', 'Xây dựng các hệ thống/tổ chức giúp cuộc sống tốt đẹp hơn']
    },
    {
        title: 'Khi nhìn vào một bức tranh phong cảnh, bạn chú ý điều gì đầu tiên?',
        options: ['Sự hài hòa của màu sắc và tính thẩm mỹ', 'Cấu trúc địa hình và các yếu tố kỹ thuật để tạo nên cảnh đó', 'Câu chuyện và cảm xúc ẩn sau phong cảnh đó', 'Sự hiện diện của con người và sự sống trong đó']
    },
    {
        title: 'Đối với bạn, một người thành công là người...?',
        options: ['Có tầm ảnh hưởng và được xã hội kính nể', 'Có kiến thức uyên bác và làm chủ được các kỹ thuật khó', 'Giúp đỡ được nhiều người nhất có thể', 'Có cuộc sống tự do và làm những gì mình thích']
    },
    {
        title: 'Bạn thường dành thời gian rảnh để?',
        options: ['Sửa chữa các đồ dùng hỏng trong nhà', 'Đọc sách tâm lý/văn học để tìm hiểu tâm hồn', 'Học thêm một phần mềm/công nghệ mới', 'Tham gia các buổi workshop/gặp gỡ bạn bè']
    },
    {
        title: 'Cách bạn vượt qua nỗi buồn thường là?',
        options: ['Vùi đầu vào công việc/học tập để quên đi', 'Tìm một người tin cậy để tâm sự và khóc thật to', 'Đi dạo giữa thiên nhiên để lòng tĩnh lặng', 'Sáng tác một thứ gì đó (viết, vẽ, nhạc)']
    },
    {
        title: 'Nếu được chọn một siêu năng lực, bạn sẽ chọn gì?',
        options: ['Đọc được suy nghĩ của người khác', 'Điều khiển và chế tạo vật chất theo ý muốn', 'Biết trước được các xu hướng/dữ liệu tương lai', 'Khả năng chữa lành mọi vết thương']
    },
    {
        title: 'Khi làm việc nhóm, điều gì làm bạn khó chịu nhất?',
        options: ['Sự vô kỷ luật và thiếu trách nhiệm', 'Sự thiếu hăng hái và sáng tạo', 'Sự cứng nhắc và áp đặt từ người khác', 'Sự thờ ơ với cảm xúc của thành viên khác']
    },
    {
        title: 'Trong một cuộc tranh luận, bạn thường là người...?',
        options: ['Bình tĩnh dùng logic để phản bác', 'Xoa dịu mâu thuẫn và tìm hướng hòa giải', 'Bảo vệ quyết liệt quan điểm của mình', 'Chờ đợi mọi người nói xong rồi mới đưa ra ý kiến chốt hạ']
    },
    {
        title: 'Bạn thích được nhận phần thưởng nào nhất?',
        options: ['Một khoản tiền thưởng xứng đáng với nỗ lực', 'Sự vinh danh và công nhận từ cộng đồng', 'Thời gian nghỉ ngơi để tái tạo năng lượng', 'Cơ hội được học một kỹ năng mới cao cấp hơn']
    },
    {
        title: 'Ưu tiên lớn nhất của bạn khi chọn hướng đi cho tương lai là gì?',
        options: ['Phải đúng với đam mê của mình trước đã', 'Phải đảm bảo thu nhập ổn định cho gia đình', 'Phải là ngành nghề có địa vị cao trong xã hội', 'Phải là nơi mình cảm thấy hạnh phúc từng giây từng phút']
    },
    {
        title: 'Câu hỏi cuối cùng: Bạn tin vào điều gì nhất?',
        options: ['Tin vào sự nỗ lực của bản thân mình', 'Tin vào sức mạnh của lòng tốt và sự tử tế', 'Tin vào tri thức và sự tiến bộ của khoa học', 'Tin vào số phận nhưng mình có quyền thay đổi nó']
    }
];

export const phase2Data = {};

majorGroups.forEach(group => {
    // Generate 10 Phase 2 questions for each group to make total 15 (5+10)
    const questions = questionTemplates.slice(0, 10).map((template, idx) => ({
        id: `q2_${group.id}_${idx}`,
        title: template.title + ' (Chọn 1)',
        type: 'single',
        options: template.options.map((opt, oIdx) => ({
            label: opt,
            value: `opt_${group.id}_${idx}_${oIdx}`,
            weight: { [group.name]: 10 }
        }))
    }));
    phase2Data[group.id] = questions;
});
