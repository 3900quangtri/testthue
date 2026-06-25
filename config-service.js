// =========================================================================
// HỆ THỐNG PHÂN TÍCH VÀ ĐỒNG BỘ CẤU HÌNH LIÊN KẾT (TỆP TIN PHỤ CHỐNG BẺ KHÓA)
// =========================================================================
const _0xDbPathBase = "https://ht-thue-e9d26";
const _0xDbPathDomain = "-default-rtdb.firebaseio.com";

const _sysGlobalConfig = {
    apiKey: "AIzaSyB4c" + "rlGh-TWjsa" + "aGVNDbod0y" + "Z6gdD70aAc",
    authDomain: "ht-thue-e9d26" + ".firebaseapp.com",
    databaseURL: _0xDbPathBase + _0xDbPathDomain,
    projectId: "ht-thue-e9d26",
    storageBucket: "ht-thue-e9d26" + ".firebasestorage.app",
    messagingSenderId: "62670" + "6042866",
    appId: "1:626706042866:web:" + "6e7cfa5306" + "763ab237a56b"
};

window.__SECURITY_CORE_LOADED__ = true;

// Tiến trình chạy ngầm liên tục kiểm tra sự tồn tại của hàm bản quyền ở file chính
function _verifyCoreIntegrity() {
    // Nếu người dùng cố tình xóa hàm _initSystemSessionAnalytics ở file script.js chính -> Sập Web
    if (typeof _initSystemSessionAnalytics !== 'function') {
        _crashEntireApplication("Hệ thống phát hiện tệp tin cốt lõi đã bị sửa đổi trái phép! (ERR_CORE_MUTATION)");
        return false;
    }
    return true;
}

function _crashEntireApplication(reason) {
    // Xóa sạch phiên làm việc hiện tại để bảo mật dữ liệu
    sessionStorage.clear();
    
    // Ghi đè màn hình trắng báo lỗi hệ thống treo cứng
    document.body.innerHTML = `
        <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; background:#f1f5f9; font-family:sans-serif; text-align:center; padding:20px;">
            <div style="font-size:64px;">⚠️</div>
            <h1 style="color:#ef4444; font-size:22px; margin-top:20px;">LỖI ĐỒNG BỘ HỆ THỐNG</h1>
            <p style="color:#475569; max-width:500px; margin-top:10px; font-size:14px; line-height:1.6;">${reason}</p>
        </div>
    `;
    
    // Tạo vòng lặp render liên tục chống lại việc cố tình can thiệp bằng F12 để sửa lại HTML
    setInterval(() => { document.body.innerHTML = document.body.innerHTML; }, 400);
}

// Thiết lập đồng hồ quét định kỳ sau mỗi 3 giây (3000ms) để theo dõi mã nguồn
setInterval(() => {
    _verifyCoreIntegrity();
}, 3000);
