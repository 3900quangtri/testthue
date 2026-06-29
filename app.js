import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ==========================================================================
// 1. CẤU HÌNH FIREBASE BẢN QUYỀN CỦA BẠN (Dùng tài khoản độc lập của bạn)
// ==========================================================================
const mySecretConfig = {
    apiKey: "AIzaSyB4crlGh-TWjsaaGVNDbod0yZ6gdD70aAc",
    databaseURL: "https://ht-thue-e9d26-default-rtdb.firebaseio.com",
    projectId: "ht-thue-e9d26"
};

const appSecure = initializeApp(mySecretConfig, "SecureLicenseApp");
const dbSecure = getDatabase(appSecure);

let isSystemUnlocked = false;

// Hàm khóa cứng ứng dụng khi vi phạm hoặc hết hạn
function triggerHardLock(message = "HỆ THỐNG ĐANG BẢO TRÌ BẢN QUYỀN") {
    document.body.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:#111;color:red;display:flex;justify-content:center;align-items:center;z-index:99999;font-family:sans-serif;flex-direction:column;padding:20px;text-align:center;">
            <h2 style="margin-bottom:10px;">${message}</h2>
            <p style="color:#94a3b8;font-size:14px;">Vui lòng liên hệ tác giả để gia hạn sử dụng mã nguồn.</p>
        </div>
    `;
    throw new Error("Ứng dụng bị dừng do vi phạm chính sách bản quyền!");
}

// Lắng nghe trạng thái bản quyền liên tục
onValue(ref(dbSecure, 'systemConfig'), (snapshot) => {
    const config = snapshot.val() || {};
    const isTestMode = config.testMode === true;
    const lockDateStr = config.lockDate || "";

    if (isTestMode) {
        triggerHardLock("HỆ THỐNG ĐANG BẢO TRÌ BẢN QUYỀN");
        return;
    }

    if (lockDateStr) {
        const currentDate = new Date();
        const expirationDate = new Date(lockDateStr + "T23:59:59");
        if (currentDate > expirationDate) {
            triggerHardLock("THỜI HẠN SỬ DỤNG PHẦN MỀM ĐÃ HẾT");
            return;
        }
    }

    isSystemUnlocked = true;
}, () => {
    triggerHardLock("LỖI KẾT NỐI XÁC THỰC BẢN QUYỀN!");
});


// ==========================================================================
// 2. CÁC HÀM TIỆN ÍCH HOẠT ĐỘNG NGẦM TRONG APP.JS
// ==========================================================================
function removeVietnameseTones(str) {
    if (!str) return '';
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ẫ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|á|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ẫ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); 
    return str;
}

function generateFallbackQrUrl(BANK_ACCOUNT, amount, info) {
    const fallbackUrl = "https://img.vietqr.io/image/970405-" + BANK_ACCOUNT + "-qr_only.png?amount=" + amount + "&addInfo=" + encodeURIComponent(info);
    document.getElementById('qrImage').src = fallbackUrl;
}


// ==========================================================================
// 3. ĐÓNG GÓI CHỨC NĂNG CỐT LÕI (SẼ XUẤT RA CHO SCRIPT.JS SỬ DỤNG)
// ==========================================================================

// Hàm Tạo QR chính thức
export async function executeGenerateQr(BANK_ACCOUNT, BANK_BIN, allData, idsum) {
    if (!isSystemUnlocked) {
        triggerHardLock("XÁC THỰC HỆ THỐNG THẤT BẠI");
        return;
    }

    const groupRecords = allData.filter(x => x.IDSUM === idsum || x.ID === idsum);
    if (groupRecords.length === 0) return;

    const baseItem = groupRecords[0];

    // Tính tổng số tiền thu thuế cộng dồn
    let totalAmount = 0;
    groupRecords.forEach(r => {
        totalAmount += (Number(r.SoTienThuThue) || 0);
    });

    const hoten = (baseItem.Ho || '') + " " + (baseItem.Ten || '');
    const rawPurpose = (baseItem.MaSoThue || '') + " " + hoten + " nop thue dat ID" + (baseItem.IDSUM || baseItem.ID || '');
    const purpose = removeVietnameseTones(rawPurpose).replace(/\s+/g, ' '); 

    // Hiển thị nội dung lên Popup giao diện công khai
    document.getElementById('qrImage').src = "https://placehold.co/300x300?text=Dang+tao+ma+QR...";
    document.getElementById('qrPopup').classList.remove('hidden');

    document.getElementById('qrInfo').innerHTML = `
        <b>Người nộp thuế:</b> ${hoten}<br>
        <b>Mã Số Thuế:</b> ${baseItem.MaSoThue || ''}<br>
        <b>CCCD:</b> ${baseItem.CCCD || ''}<br>
        <b>Số khoản thuế phải nộp:</b> <span style="font-weight:bold; color:#4338ca;">${groupRecords.length} </span><br>
        <b>Tổng số tiền phải nộp:</b> <span style="color:#1e3a8a; font-weight:bold;">${totalAmount.toLocaleString('vi-VN')} đ</span><br>
        <b>Nội dung chuyển khoản:</b> <span style="color:#c2410c; font-weight:bold;">${purpose}</span>
    `;

    try {
        const response = await fetch("https://api.vietqr.io/v2/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                accountNo: BANK_ACCOUNT,
                accountName: hoten, 
                acqId: BANK_BIN,
                amount: totalAmount,
                addInfo: purpose, 
                format: "qr_only",
                template: "compact"
            })
        });

        const result = await response.json();
        if (result && result.code === "00") {
            document.getElementById('qrImage').src = result.data.qrDataURL;
        } else {
            generateFallbackQrUrl(BANK_ACCOUNT, totalAmount, purpose);
        }
    } catch (error) {
        generateFallbackQrUrl(BANK_ACCOUNT, totalAmount, purpose);
    }
}

// Hàm đóng Popup (Được đưa ra window toàn cục để index.html bắt được sự kiện onclick)
window.closePopup = function() {
    document.getElementById('qrPopup').classList.add('hidden');
    // Nếu trong script.js có biến lưu trữ ID đang chọn, chúng ta cũng giải phóng nó
    if(window.clearCurrentSelectedIdSum) {
        window.clearCurrentSelectedIdSum();
    }
};

// Hàm Cập nhật trạng thái đóng thuế hàng loạt lên Firebase của ĐỐI TÁC
// Nhận vào đối tượng database kết nối của họ truyền sang từ script.js
export function executeVerifyAndPayChange(inputElement, dbPartner, allData, currentSelectedIdSum, renderTable, updateStats) {
    if (!isSystemUnlocked) {
        triggerHardLock("HỆ THỐNG ĐÃ BỊ KHÓA BẢN QUYỀN");
        return;
    }

    // Ngăn chặn vòng lặp sự kiện gạt trạng thái
    if (window.isUpdatingToggle === true) return; 

    if (!currentSelectedIdSum) {
        alert("Không tìm thấy mã định danh khoản nộp thuế hiện tại!");
        return;
    }

    const isChecked = inputElement.checked; 
    const label = document.getElementById('toggleStatusLabel');
    
    label.innerText = isChecked ? "ON (Đã Nộp)" : "OFF (Chưa Nộp)";
    label.style.color = isChecked ? "#10b981" : "#ef4444";

    // Tìm toàn bộ danh sách các dòng dữ liệu thuộc cụm IDSUM này
    const groupRecords = allData.filter(x => x.IDSUM === currentSelectedIdSum || x.ID === currentSelectedIdSum);
    if (groupRecords.length === 0) return;

    if (!confirm(`Bạn có chắc chắn muốn cập nhật trạng thái đồng loạt cho ${groupRecords.length} khoản thuế này thành [${isChecked ? 'ĐÃ NỘP' : 'CHƯA NỘP'}] không?`)) {
        window.isUpdatingToggle = true;
        inputElement.checked = !isChecked;
        label.innerText = !isChecked ? "ON (Đã Nộp)" : "OFF (Chưa Nộp)";
        label.style.color = !isChecked ? "#10b981" : "#ef4444";
        window.isUpdatingToggle = false;
        return;
    }

    // Đóng gói dữ liệu cập nhật hàng loạt lên Firebase của ĐỐI TÁC
    const updates = {};
    groupRecords.forEach(item => {
        updates[`QRCodeTax/${item.id_key}/DaThanhToan`] = isChecked;
        item.DaThanhToan = isChecked; // Đồng bộ dữ liệu mảng cục bộ
    });

    // Hàm update() nhận diện đường dẫn gốc tương tự database cũ của họ
    const rootRef = ref(dbPartner);
    update(rootRef, updates)
    .then(() => {
        alert("Đồng bộ cập nhật trạng thái lên hệ thống thành công!");
        renderTable(); 
        updateStats(); 
    })
    .catch(err => {
        alert("Lỗi đồng bộ dữ liệu lên Firebase: " + err.message);
        window.isUpdatingToggle = true;
        inputElement.checked = !isChecked;
        label.innerText = !isChecked ? "ON (Đã Nộp)" : "OFF (Chưa Nộp)";
        label.style.color = !isChecked ? "#10b981" : "#ef4444";
        window.isUpdatingToggle = false;
    });
}
