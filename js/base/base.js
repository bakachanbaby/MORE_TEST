class BasePage {
    TableId = null;
    Api = null;
    constructor(tableId, api) {
        this.TableId = tableId;
        this.Api = api;
        this.loadData();
    }

    loadData() {
        // Lam sach bang
        $(`table#${tableId} tbody`).empty();

        // Gọi lên api thực hiện lấy dữ liệu:

        $.ajax({
            type: "GET",
            url: this.Api,
            async: true,
            success: function(response) {
                var entities = response;
                // Duyệt các cột của table để biết table có bao nhiêu cột dữ liệu: 
                let ths = $(`table#${tableId} tbody`);
                //Duyệt từng nhân viên trong mảng:
                for (let e of entities) {
                    // e.DateOfBirth = CommonJS.formatDate(e.DateOfBirth);
                    // Build từng tr và append vào tbody của table:
                    let tr = $(`<tr>
                                <td class="text-align-left">${e.CustomerCode}</td>
                                <td class="text-align-left">${e.FullName}</td>
                                <td class="text-align-left">${e.GenderName}</td>
                                <td class="text-align-center">${e.DateOfBirth}</td>
                                <td class="text-align-center">${e.PhoneNumber}</td>
                                <td class="text-align-left">${e.Email}</td>
                                <td class="text-align-left">${e.Address}</td>
                                </tr>`);
                    // Lưu trử khóa chính của dòng dữ liệu hiện tại: 
                    tr.data("employeeId", e.CustomerId);
                    tr.data("data", e);
                    // Thêm tr vào trong bảng
                    $('#tbdlCustomerList tbody').append(tr);
                }
                $('.m-loading').hide();
            },
            error: function(res) {
                alert("Co loi xay ra");
            }
        });
        // Xác định element sẽ hiện thị dữ liệu:
        let table = $('#tbdlCustomerList')

    }
}