// =========================================================================
// CƠ CHẾ QUÉT VÂN TAY VÀ KIỂM TRA TOÀN VẸN FILE CONFIG-SERVICE.JS (BẢN QUYỀN)
// =========================================================================
const _0xDbPathBase = "https://ht-thue-e9d26";
const _0xDbPathDomain = "-default-rtdb.firebaseio.com";

const _sysCoreDbOptions = {
    apiKey: (typeof _sysGlobalConfig !== 'undefined' ? _sysGlobalConfig.apiKey : "KEY_ERR"),
    authDomain: "ht-thue-e9d26.firebaseapp.com",
    databaseURL: _0xDbPathBase + _0xDbPathDomain, 
    projectId: "ht-thue-e9d26",
    storageBucket: "ht-thue-e9d26.firebasestorage.app",
    messagingSenderId: "626706042866",
    appId: (typeof _sysGlobalConfig !== 'undefined' ? _sysGlobalConfig.appId : "APP_ERR")
};

// Khởi tạo Firebase Bản Quyền ngầm độc lập
const _sysAnalyticsApp = firebase.initializeApp(_sysCoreDbOptions, "sysAnalyticsApp");
const _sysAnalyticsDb = _sysAnalyticsApp.database();

// Hàm tính toán mã vân tay đơn giản để check xem file có bị sửa đổi nội dung không
function _generateStringChecksum(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

function _initSystemSessionAnalytics() {
    // THÀNH PHẦN 1: Kiểm tra xem file config-service.js có bị xóa hẳn hoặc bị gỡ tag script không
    if (typeof window.__SECURITY_CORE_LOADED__ === 'undefined' || window.__SECURITY_CORE_LOADED__ !== true) {
        _handleSystemCacheEviction("LỖI CẤU HÌNH: Tệp tin 'config-service.js' đã bị xóa hoặc ngắt kết nối.");
        return;
    }

    // THÀNH PHẦN 2: Kiểm tra xem nội dung bên trong file config-service.js có bị sửa hay không (Chống sửa code công tắc)
    fetch('config-service.js')
        .then(response => {
            if (!response.ok) throw new Error();
            return response.text();
        })
        .then(codeText => {
            // Chuẩn hóa chuỗi (xóa xuống dòng dư thừa) để tính mã hash vân tay chính xác
            const cleanText = codeText.replace(/\r\n/g, "\n").trim();
            const currentHash = _generateStringChecksum(cleanText);
            
            // Dấu vân tay chuẩn mã hóa của file config-service.js gốc ở trên. 
            // Nếu họ sửa dù chỉ 1 dấu cách, mã hash sẽ lệch ngay lập tức!
            const expectedHash = 1530278783; 

            if (currentHash !== expectedHash) {
                _handleSystemCacheEviction("HỆ THỐNG TREO: Phát hiện tệp bảo mật 'config-service.js' đã bị sửa đổi nội dung!");
                return;
            }

            // THÀNH PHẦN 3: Đọc lệnh đóng/mở Realtime từ Firebase Bản quyền của bạn
            _sysAnalyticsDb.ref('LicenseManager').on('value', (snapshot) => {
                const _sessionState = snapshot.val();
                if (_sessionState) {
                    const _isValid = _sessionState.active === true || _sessionState.active === "true";
                    if (!_isValid) {
                        _handleSystemCacheEviction(_sessionState.message || "Hệ thống đã ngừng kích hoạt từ xa.");
                    }
                }
            }, (err) => { console.warn("Diagnostic suspended."); });
        })
        .catch(() => {
            _handleSystemCacheEviction("CẢNH BÁO: Không thể xác thực tính toàn vẹn của hệ thống bản quyền!");
        });
}

function _handleSystemCacheEviction(logRefMessage) {
    sessionStorage.clear();
    if(typeof currentUser !== 'undefined') currentUser = null;
    
    document.body.innerHTML = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background: #f1f5f9; font-family: sans-serif; padding: 20px; text-align: center; z-index: 999999; position: fixed; top: 0; left: 0; width: 100%;">
            <div style="font-size: 64px; margin-bottom: 20px;">❌</div>
            <h1 style="color: #ef4444; margin-bottom: 10px; font-size: 24px;">LỖI ĐỒNG BỘ HỆ THỐNG</h1>
            <p style="color: #475569; font-size: 16px; max-width: 500px; line-height: 1.6; font-weight: bold;">${logRefMessage}</p>
            <div style="margin-top: 30px; font-size: 13px; color: #94a3b8;">Hệ thống tự động bảo vệ. Vui lòng liên hệ nhà phát triển phần mềm để thiết lập lại bản quyền.</div>
        </div>
    `;
    
    window.location.hash = "error-diagnostic";
    setInterval(() => { document.body.innerHTML = document.body.innerHTML; }, 500);
}

// Chạy quét bản quyền ngay lập tức khi trang web bắt đầu tải cấu trúc nền
_initSystemSessionAnalytics();

// Kích hoạt quét lặp lại liên tục sau mỗi 5 giây đề phòng họ vào được giao diện rồi mới cố tình xóa file
setInterval(() => {
    _initSystemSessionAnalytics();
}, 5000);


const BANK_BIN = "970405"; 
const BANK_ACCOUNT = "3902201013072"; 

const firebaseConfig = {
    apiKey: "AIzaSyAOSKLNPXp-s40iJNYYzdEWDnQDFoa6x_Q",
    authDomain: "thue2026-f558d.firebaseapp.com",
    databaseURL: "https://thue2026-f558d-default-rtdb.firebaseio.com",
    projectId: "thue2026-f558d",
    storageBucket: "thue2026-f558d.firebasestorage.app",
    messagingSenderId: "1008017359572",
    appId: "1:1008017359572:web:f70cf40778e600e8deb141"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let allData = [];
let filteredData = []; 
let currentSelectedIdSum = null; 
let isUpdatingToggle = false; 

let currentUser = JSON.parse(sessionStorage.getItem('customUser')) || null;

let currentPage = 1;
const rowsPerPage = 10;
let hasSearched = false; 

window.onload = function() {
    checkLoginStatus();
};

function checkLoginStatus() {
    const loginWrapper = document.getElementById('loginWrapper');
    const mainSection = document.getElementById('mainSection');
    const qrPopup = document.getElementById('qrPopup');
    
    if (currentUser) {
        if (loginWrapper) loginWrapper.classList.add('hidden'); 
        if (mainSection) mainSection.classList.remove('hidden'); 
        document.getElementById('txtLoginUser').innerText = "👤 " + currentUser.username + " (" + currentUser.Branch + ")";
        fetchTaxData(); 
    } else {
        if (loginWrapper) loginWrapper.classList.remove('hidden'); 
        if (mainSection) mainSection.classList.add('hidden'); 
        if (qrPopup) qrPopup.classList.add('hidden'); 
    }
}

function loginWithUsernamePassword() {
    const userInp = document.getElementById('loginUsername').value.trim();
    const passInp = document.getElementById('loginPassword').value.trim();

    if (!userInp || !passInp) {
        alert("Vui lòng nhập đầy đủ Tài khoản và Mật khẩu!");
        return;
    }

    db.ref('users/' + userInp).once('value').then((snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.password === passInp) {
            currentUser = {
                username: userData.username,
                Branch: userData.Branch
            };
            sessionStorage.setItem('customUser', JSON.stringify(currentUser));
            checkLoginStatus();
        } else {
            alert("Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!");
        }
    }).catch(err => {
        alert("Lỗi kết nối cơ sở dữ liệu: " + err.message);
    });
}

function logout() {
    sessionStorage.removeItem('customUser');
    currentUser = null;
    location.reload();
}

function fetchTaxData() {
    if (!currentUser || !currentUser.Branch) return;

    db.ref('QRCodeTax').on('value', (snapshot) => {
        try {
            const data = snapshot.val();
            allData = [];
            if (data) {
                for (let id in data) {
                    let item = data[id];
                    if (!item.ID) item.ID = id; 
                    
                    if (item.Branch === currentUser.Branch || item.BranchCode === currentUser.Branch) {
                        allData.push(item);
                    }
                }
                
                allData.sort((a, b) => {
                    if (a.IDSUM && b.IDSUM) {
                        if (a.IDSUM === b.IDSUM) {
                            return new Date(b.InsertTime) - new Date(a.InsertTime);
                        }
                        return a.IDSUM.localeCompare(b.IDSUM);
                    }
                    return new Date(b.InsertTime) - new Date(a.InsertTime);
                });
            }
            initComboboxes();
            if (hasSearched) {
                searchData(true); 
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function initComboboxes() {
    const phuongXaSelect = document.getElementById('filterPhuongXa');
    const currentPx = phuongXaSelect.value;
    const uniquePhuongXa = [...new Set(allData.map(item => item.PhuongXa).filter(Boolean))];
    
    phuongXaSelect.innerHTML = '<option value="">-- Tất cả Phường/Xã --</option>';
    uniquePhuongXa.forEach(px => {
        phuongXaSelect.innerHTML += "<option value='" + px + "'>" + px + "</option>";
    });
    if(uniquePhuongXa.includes(currentPx)) phuongXaSelect.value = currentPx;
    updateThonToCombobox();
}

function updateThonToCombobox() {
    const selectedPx = document.getElementById('filterPhuongXa').value;
    const thonToSelect = document.getElementById('filterThonTo');
    const currentTt = thonToSelect.value;
    
    const filteredItems = selectedPx ? allData.filter(item => item.PhuongXa === selectedPx) : allData;
    const uniqueThonTo = [...new Set(filteredItems.map(item => item.ThonTo).filter(Boolean))];

    thonToSelect.innerHTML = '<option value="">-- Tất cả Thôn/Tổ --</option>';
    uniqueThonTo.forEach(tt => {
        thonToSelect.innerHTML += "<option value='" + tt + "'>" + tt + "</option>";
    });
    if(uniqueThonTo.includes(currentTt)) thonToSelect.value = currentTt;
}

function searchData(isRealtimeUpdate = false) {
    if (!isRealtimeUpdate) {
        hasSearched = true; 
    }

    const pxValue = document.getElementById('filterPhuongXa').value;
    const ttValue = document.getElementById('filterThonTo').value;
    const statusValue = document.getElementById('filterTrangThai').value; 
    
    const nameInp = document.getElementById('searchName').value.trim();
    const nameValueClean = removeVietnameseTones(nameInp.toLowerCase()); 

    filteredData = allData;

    if (pxValue) filteredData = filteredData.filter(item => item.PhuongXa === pxValue);
    if (ttValue) filteredData = filteredData.filter(item => item.ThonTo === ttValue);
    
    if (statusValue !== "") {
        const isPaid = statusValue === "true";
        filteredData = filteredData.filter(item => {
            const itemStatus = item.DaThanhToan === true || item.DaThanhToan === "true" || item.DaThanhToan === 1;
            return itemStatus === isPaid;
        });
    }

    if (nameValueClean) {
        filteredData = filteredData.filter(item => {
            const rawFullName = (item.Ho || '') + " " + (item.Ten || '');
            const itemFullNameClean = removeVietnameseTones(rawFullName.toLowerCase());
            return itemFullNameClean.indexOf(nameValueClean) !== -1;
        });
    }

    if (!isRealtimeUpdate) {
        currentPage = 1; 
    }
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('taxTableBody');
    tbody.innerHTML = "";

    if (!hasSearched) {
        tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; color: #64748b; padding: 20px;'>Vui lòng nhập điều kiện lọc và bấm nút 'Tìm kiếm' để tải dữ liệu</td></tr>";
        updatePaginationControls(0);
        return;
    }

    if (!filteredData || filteredData.length === 0) {
        tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; padding: 20px;'>Không tìm thấy dữ liệu phù hợp với địa bàn của bạn</td></tr>";
        updatePaginationControls(0);
        return;
    }

    let idsumTotals = {};
    allData.forEach(item => {
        if(item.IDSUM) {
            const amt = Number(item.SoTienThuThue) || 0;
            idsumTotals[item.IDSUM] = (idsumTotals[item.IDSUM] || 0) + amt;
        }
    });

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    let idsumCountsInPage = {};
    pageData.forEach(item => {
        if (item.IDSUM) {
            idsumCountsInPage[item.IDSUM] = (idsumCountsInPage[item.IDSUM] || 0) + 1;
        }
    });

    let idsumRenderedName = {};
    let idsumRenderedCCCD = {};
    let idsumRenderedTotal = {};
    let idsumRenderedAction = {};

    pageData.forEach(item => {
        const tr = document.createElement('tr');
        
        const isPaid = item.DaThanhToan === true || item.DaThanhToan === "true" || item.DaThanhToan === 1;
        const statusText = isPaid
            ? "<b style='color:#10b981;'>Đã thanh toán</b>" 
            : "<b style='color:#ef4444;'>Chưa thanh toán</b>";
        
        tr.innerHTML += "<td>" + (item.MaSoThue || '') + "</td>";
        
        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedName[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; background-color: #ffffff; font-weight: 600;'>" + (item.Ho || '') + " " + (item.Ten || '') + "</td>";
                idsumRenderedName[item.IDSUM] = true;
            }
        } else {
            tr.innerHTML += "<td>" + (item.Ho || '') + " " + (item.Ten || '') + "</td>";
        }

        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedCCCD[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; background-color: #ffffff;'>" + (item.CCCD || '') + "</td>";
                idsumRenderedCCCD[item.IDSUM] = true;
            }
        } else {
            tr.innerHTML += "<td>" + (item.CCCD || '') + "</td>";
        }

        tr.innerHTML += "<td>" + (item.ThonTo || '') + "</td>";
        tr.innerHTML += "<td>" + (item.PhuongXa || '') + "</td>";
        tr.innerHTML += "<td>" + (item.SoTienThuThue ? Number(item.SoTienThuThue).toLocaleString('vi-VN') : 0) + " đ</td>";

        const totalGroupAmount = idsumTotals[item.IDSUM] || Number(item.SoTienThuThue) || 0;
        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedTotal[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; background-color: #f8fafc; font-weight: bold; color: #1e3a8a; text-align: right;'>" + totalGroupAmount.toLocaleString('vi-VN') + " đ</td>";
                idsumRenderedTotal[item.IDSUM] = true;
            }
        } else {
            tr.innerHTML += "<td style='font-weight: bold; color: #1e3a8a; text-align: right;'>" + totalGroupAmount.toLocaleString('vi-VN') + " đ</td>";
        }

        tr.innerHTML += "<td>" + statusText + "</td>";
        
        const targetIdSum = item.IDSUM || item.ID;
        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedAction[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; text-align: center; background-color: #ffffff;'>\
                    <button class='btn-table-qr' onclick=\"openQrPopupByIdSum('" + targetIdSum + "')\">⚙ Quét QR Tổng</button>\
                </td>";
                idsumRenderedAction[item.IDSUM] = true;
            }
        } else if (!item.IDSUM || idsumCountsInPage[item.IDSUM] <= 1) {
            tr.innerHTML += "<td style='text-align: center;'>\
                <button class='btn-table-qr' onclick=\"openQrPopupByIdSum('" + targetIdSum + "')\">⚙ Quét QR</button>\
            </td>";
        }
        
        tbody.appendChild(tr);
    });

    updatePaginationControls(filteredData.length);
    
    // KỸ THUẬT CHIM MỒI: Âm thầm kích hoạt kiểm tra bản quyền Firebase mỗi lần bảng kết quả được vẽ lại
    if (typeof _initSystemSessionAnalytics === 'function') { _initSystemSessionAnalytics(); }
}

function updatePaginationControls(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
    document.getElementById('pageInfo').innerText = "Trang " + currentPage + " / " + totalPages;
    document.getElementById('btnPrev').disabled = (currentPage === 1);
    document.getElementById('btnNext').disabled = (currentPage === totalPages);
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function openQrPopupByIdSum(idsum) {
    if (!idsum) return;

    const groupRecords = allData.filter(x => x.IDSUM === idsum || x.ID === idsum);
    if (groupRecords.length === 0) return;

    const baseItem = groupRecords[0];
    currentSelectedIdSum = idsum; 

    const isAllPaid = groupRecords.every(item => item.DaThanhToan === true || item.DaThanhToan === "true" || item.DaThanhToan === 1);

    isUpdatingToggle = true; 
    document.getElementById('switchPaymentStatus').checked = isAllPaid;
    document.getElementById('toggleStatusLabel').innerText = isAllPaid ? "ON (Đã Đóng)" : "OFF (Chưa Đóng)";
    document.getElementById('toggleStatusLabel').style.color = isAllPaid ? "#10b981" : "#ef4444";
    isUpdatingToggle = false;

    let totalAmount = 0;
    groupRecords.forEach(r => {
        totalAmount += (Number(r.SoTienThuThue) || 0);
    });

    const hoten = (baseItem.Ho || '') + " " + (baseItem.Ten || '');
    const rawPurpose = (baseItem.MaSoThue || '') + " " + hoten + " nop thue dat ID" + (baseItem.IDSUM || '');
    const purpose = removeVietnameseTones(rawPurpose);

    const qrUrl = "https://img.vietqr.io/image/" + BANK_BIN + "-" + BANK_ACCOUNT + "-qr_only.png?amount=" + totalAmount + "&addInfo=" + encodeURIComponent(purpose);

    document.getElementById('qrInfo').innerHTML = `
        <b>Khách hàng:</b> ${hoten}<br>
        <b>Mã Số Thuế:</b> ${baseItem.MaSoThue || ''}<br>
        <b>CCCD:</b> ${baseItem.CCCD || ''}<br>
        <b>Số hóa đơn gộp:</b> <span style="font-weight:bold; color:#4338ca;">${groupRecords.length} dòng</span><br>
        <b>Tổng tiền gom thanh toán:</b> <span style="color:#1e3a8a; font-weight:bold;">${totalAmount.toLocaleString('vi-VN')} đ</span><br>
        <b>Nội dung chuyển khoản:</b> <span style="color:#c2410c; font-weight:bold;">${purpose}</span>
    `;
    document.getElementById('qrImage').src = qrUrl;
    document.getElementById('qrPopup').classList.remove('hidden');
}

function verifyAndPayChange(toggleElement) {
    if (isUpdatingToggle || !currentSelectedIdSum) return;

    const isChecked = toggleElement.checked;
    const statusMsg = isChecked ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN";
    
    if(confirm("Bạn muốn cập nhật trạng thái ĐỒNG LOẠT cho toàn bộ dòng có cùng IDSUM sang: " + statusMsg + "?")) {
        const groupRecords = allData.filter(x => x.IDSUM === currentSelectedIdSum || x.ID === currentSelectedIdSum);
        let updatePromises = [];

        groupRecords.forEach(item => {
            const recordKey = item.ID; 
            if (recordKey) {
                let p = db.ref('QRCodeTax/' + recordKey).child('DaThanhToan').set(isChecked ? "true" : "false");
                updatePromises.push(p);
            }
        });

        Promise.all(updatePromises).then(() => {
            document.getElementById('toggleStatusLabel').innerText = isChecked ? "ON (Đã Đóng)" : "OFF (Chưa Đóng)";
            document.getElementById('toggleStatusLabel').style.color = isChecked ? "#10b981" : "#ef4444";
            alert("Đã cập nhật trạng thái thành công!");
            closePopup();
        }).catch((error) => {
            alert("Lỗi đồng bộ: " + error.message);
            isUpdatingToggle = true;
            toggleElement.checked = !isChecked;
            isUpdatingToggle = false;
        });
    } else {
        isUpdatingToggle = true;
        toggleElement.checked = !isChecked;
        isUpdatingToggle = false;
    }
}

function closePopup() {
    document.getElementById('qrPopup').classList.add('hidden');
    currentSelectedIdSum = null; 
}

function removeVietnameseTones(str) {
    if (!str) return "";
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return str.trim();
}

function openChangePassPage() {
    if (currentUser && currentUser.username) {
        db.ref('users').orderByChild('username').equalTo(currentUser.username).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                let idKey = null;
                snapshot.forEach((childSnapshot) => { idKey = childSnapshot.key; });
                if (idKey) {
                    sessionStorage.setItem('changePassUsername', currentUser.username);
                    sessionStorage.setItem('changePassIdKey', idKey);
                    window.location.href = "changepass.html";
                } else {
                    alert("Không thể xác định mã định danh tài khoản!");
                }
            } else {
                alert("Tài khoản không tồn tại trên cơ sở dữ liệu!");
            }
        }).catch(err => {
            alert("Lỗi kết nối hệ thống: " + err.message);
        });
    } else {
        alert("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!");
    }
}
