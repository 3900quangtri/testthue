// CẤU HÌNH NGÂN HÀNG ĐÍCH
// LƯU Ý: Chuyển đổi mã chữ sang mã số BIN 6 số của Napas (VBA -> 970405) để API POST chạy được
import { executeGenerateQr, executeVerifyAndPayChange } from "./app.js";
// ĐẨY KHAI BÁO BIẾN TOÀN CỤC CHO POPUP LÊN ĐẦU
window.isUpdatingToggle = false; 
window.clearCurrentSelectedIdSum = function() {
    currentSelectedIdSum = null;
};
window.loginWithUsernamePassword = function() { loginWithUsernamePassword(); };
window.handleSearch = function() { handleSearch(); };
window.searchData = function() { handleSearch(); };
window.clearSearch = function() { clearSearch(); };
window.prevPage = function() { prevPage(); };
window.nextPage = function() { nextPage(); };
window.logout = function() { logout(); };
window.redirectToChangePassPage = function() { redirectToChangePassPage(); };
window.goToChangePassPage = function() { redirectToChangePassPage(); };
const BANK_BIN = "970405"; // 970405 là mã định danh BIN của Agribank
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
window.isUpdatingToggle = false; 
window.clearCurrentSelectedIdSum = function() {
    currentSelectedIdSum = null;
};
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
        document.getElementById('txtLoginUser').innerText = "👤 " + currentUser.username;
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
                
                // Đồng bộ sắp xếp theo IDSUM để các dòng cùng IDSUM nằm cạnh nhau
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

    // XỬ LÝ TÌM KIẾM GẦN ĐÚNG THEO TÊN
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
        tbody.innerHTML = "<tr><td colspan='10' style='text-align:center; color: #64748b; padding: 20px;'>Vui lòng nhập điều kiện lọc và bấm nút 'Tìm kiếm' để tải dữ liệu</td></tr>";
        updatePaginationControls(0);
        return;
    }

    if (!filteredData || filteredData.length === 0) {
        tbody.innerHTML = "<tr><td colspan='10' style='text-align:center; padding: 20px;'>Không tìm thấy dữ liệu phù hợp với địa bàn của bạn</td></tr>";
        updatePaginationControls(0);
        return;
    }

    // 1. Tính tổng tiền tích lũy theo IDSUM toàn cục
    let idsumTotals = {};
    allData.forEach(item => {
        if(item.IDSUM) {
            const amt = Number(item.SoTienThuThue) || 0;
            idsumTotals[item.IDSUM] = (idsumTotals[item.IDSUM] || 0) + amt;
        }
    });

    // 2. Phân trang dữ liệu
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    // 3. Đếm số dòng xuất hiện của từng IDSUM trong trang hiện tại để tạo thuộc tính Rowspan
    let idsumCountsInPage = {};
    pageData.forEach(item => {
        if (item.IDSUM) {
            idsumCountsInPage[item.IDSUM] = (idsumCountsInPage[item.IDSUM] || 0) + 1;
        }
    });
    let idsumRenderedMST = {};
    let idsumRenderedName = {};
    let idsumRenderedCCCD = {};
    let idsumRenderedThonTo = {};
    let idsumRenderedPhuongXa = {};
    let idsumRenderedTotal = {};
    let idsumRenderedStatus = {};
    let idsumRenderedAction = {};

    // 4. Sinh các dòng của bảng
    pageData.forEach(item => {
        const tr = document.createElement('tr');
        
        const isPaid = item.DaThanhToan === true || item.DaThanhToan === "true" || item.DaThanhToan === 1;
        const statusText = isPaid
            ? "<b style='color:#10b981;'>Đã thanh toán</b>" 
            : "<b style='color:#ef4444;'>Chưa thanh toán</b>";
        
        // Cột 1: Mã số thuế
        //tr.innerHTML += "<td>" + (item.MaSoThue || '') + "</td>";
        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedMST[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; background-color: #ffffff;'>" + (item.MaSoThue || '') + "</td>";
                idsumRenderedMST[item.IDSUM] = true;
            }
        } else {
            tr.innerHTML += "<td>" + (item.MaSoThue || '') + "</td>";
        }
        
        // Cột 2: Họ và Tên (Gộp ô)
        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedName[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; background-color: #ffffff; '>" + (item.Ho || '') + " " + (item.Ten || '') + "</td>";
                idsumRenderedName[item.IDSUM] = true;
            }
        } else {
            tr.innerHTML += "<td>" + (item.Ho || '') + " " + (item.Ten || '') + "</td>";
        }

        // Cột 3: CCCD (Gộp ô tương tự Họ Tên)
        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedCCCD[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; background-color: #ffffff;'>" + (item.CCCD || '') + "</td>";
                idsumRenderedCCCD[item.IDSUM] = true;
            }
        } else {
            tr.innerHTML += "<td>" + (item.CCCD || '') + "</td>";
        }

        // Cột 4, 5, 6: Địa bàn và số tiền lẻ dòng
        //tr.innerHTML += "<td>" + (item.ThonTo || '') + "</td>";
        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedThonTo[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; background-color: #ffffff;'>" + (item.ThonTo || '') + "</td>";
                idsumRenderedThonTo[item.IDSUM] = true;
            }
        } else {
            tr.innerHTML += "<td>" + (item.ThonTo || '') + "</td>";
        }
        //tr.innerHTML += "<td>" + (item.PhuongXa || '') + "</td>";
        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedPhuongXa[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; background-color: #ffffff;'>" + (item.PhuongXa || '') + "</td>";
                idsumRenderedPhuongXa[item.IDSUM] = true;
            }
        } else {
            tr.innerHTML += "<td>" + (item.PhuongXa || '') + "</td>";
        }
        tr.innerHTML += "<td>" + (item.MaPhiNN || '') + "</td>";
        tr.innerHTML += "<td>" + (item.TieuMuc || '') + "</td>";
        tr.innerHTML += "<td>" + (item.SoTienThuThue ? Number(item.SoTienThuThue).toLocaleString('vi-VN') : 0) + " đ</td>";

        // Cột 7: Tổng tiền thanh toán nộp gộp (Gộp ô theo IDSUM)
        const totalGroupAmount = idsumTotals[item.IDSUM] || Number(item.SoTienThuThue) || 0;
        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedTotal[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; background-color: #f8fafc; font-weight: bold; color: #1e3a8a; text-align: right;'>" + totalGroupAmount.toLocaleString('vi-VN') + " đ</td>";
                idsumRenderedTotal[item.IDSUM] = true;
            }
        } else {
            tr.innerHTML += "<td style='font-weight: bold; color: #1e3a8a; text-align: right;'>" + totalGroupAmount.toLocaleString('vi-VN') + " đ</td>";
        }

        // Cột 8: Trạng thái dòng lẻ
        //tr.innerHTML += "<td>" + statusText + "</td>";
        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedStatus[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; background-color: #ffffff;'>" + statusText + "</td>";
                idsumRenderedStatus[item.IDSUM] = true;
            }
        } else {
            tr.innerHTML += "<td>" + statusText + "</td>";
        }
        
        // Cột 9: Hành động gộp chung duy nhất một nút bấm mã QR cho các dòng cùng IDSUM
        const targetIdSum = item.IDSUM || item.ID;
        if (item.IDSUM && idsumCountsInPage[item.IDSUM] > 1) {
            if (!idsumRenderedAction[item.IDSUM]) {
                tr.innerHTML += "<td rowspan='" + idsumCountsInPage[item.IDSUM] + "' style='vertical-align: middle; text-align: center; background-color: #ffffff;'>\
                    <button class='btn-table-qr' onclick=\"openQrPopupByIdSum('" + targetIdSum + "')\">⚙ Quét QR</button>\
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

async function openQrPopupByIdSum(idsum) {
    if (!idsum) return;

    const groupRecords = allData.filter(x => x.IDSUM === idsum || x.ID === idsum);
    if (groupRecords.length === 0) return;

    const baseItem = groupRecords[0];
    currentSelectedIdSum = idsum; 

    // Kiểm tra trạng thái gạt bật ON/OFF cho cục bộ
    const isAllPaid = groupRecords.every(item => item.DaThanhToan === true || item.DaThanhToan === "true" || item.DaThanhToan === 1);

    window.isUpdatingToggle = true; 
    document.getElementById('switchPaymentStatus').checked = isAllPaid;
    document.getElementById('toggleStatusLabel').innerText = isAllPaid ? "ON (Đã Nộp)" : "OFF (Chưa Nộp)";
    document.getElementById('toggleStatusLabel').style.color = isAllPaid ? "#10b981" : "#ef4444";
    window.isUpdatingToggle = false;

    // Ủy quyền gọi API tạo QR sang cho file bảo mật app.js kiểm tra bản quyền
    executeGenerateQr(BANK_ACCOUNT, BANK_BIN, allData, idsum);
}

// THAY THẾ HOÀN TOÀN HÀM verifyAndPayChange CŨ THÀNH HÀM MỚI DƯỚI ĐÂY:
function verifyAndPayChange(el) {
    // Lấy link kết nối database của họ từ thư viện V8 truyền sang thư viện V10 của file app.js
    // Bản chất là chuyển đổi con trỏ kết nối Firebase để file B thực thi lệnh ghi dữ liệu
    const dbPartnerInstance = firebase.app().database(); 
    
    // Gọi hàm thực thi đồng bộ thuế hàng loạt sang file app.js để kiểm tra khóa hay mở
    executeVerifyAndPayChange(el, dbPartnerInstance, allData, currentSelectedIdSum, renderTable, updateStats);
}

// Đẩy các hàm này ra phạm vi Window để index.html gọi onclick/onchange bình thường
window.openQrPopupByIdSum = openQrPopupByIdSum;
window.verifyAndPayChange = verifyAndPayChange;

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

// Thay thế hoặc thêm hàm này vào cuối file script.js của trang chính (index.html)
function goToChangePassPage() {
    // Kiểm tra xem hệ thống đã có thông tin currentUser chưa
    if (currentUser && currentUser.username) {
        
        // Bước 1: Truy vấn Firebase một lần nữa để lấy chính xác id_key dựa vào username hiện tại
        db.ref('users').orderByChild('username').equalTo(currentUser.username).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                let idKey = null;
                
                snapshot.forEach((childSnapshot) => {
                    idKey = childSnapshot.key; // Lấy chính xác id_key (ví dụ: "canbo01", "user_123"...)
                });

                if (idKey) {
                    // Bước 2: Lưu cả username và id_key vào sessionStorage
                    sessionStorage.setItem('changePassUsername', currentUser.username);
                    sessionStorage.setItem('changePassIdKey', idKey);
                    
                    // Bước 3: Chuyển hướng sang trang đổi mật khẩu độc lập
                    window.location.href = "changepass.html";
                } else {
                    alert("Không thể xác định mã định danh (id_key) của tài khoản!");
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
// Đẩy tất cả các hàm tương tác sự kiện HTML ra phạm vi toàn cục (Global)
window.loginWithUsernamePassword = loginWithUsernamePassword;
window.handleSearch = handleSearch;
window.clearSearch = clearSearch;
window.prevPage = prevPage;
window.nextPage = nextPage;
window.redirectToChangePassPage = redirectToChangePassPage;
window.searchData = handleSearch;
window.searchData = handleSearch; // Ánh xạ dự phòng lỗi searchData
// 1. Khai báo lộ diện hàm Đăng xuất
window.logout = logout;
// 2. Khai báo lộ diện hàm Đổi mật khẩu gốc của bạn
window.redirectToChangePassPage = redirectToChangePassPage;
// 3. Tạo một liên kết ánh xạ (Alias) để nếu HTML gọi goToChangePassPage() thì hệ thống vẫn hiểu và chạy đúng
window.goToChangePassPage = redirectToChangePassPage;
