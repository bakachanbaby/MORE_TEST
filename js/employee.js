$(document).ready(function() {
    new EmlpoyeePage();
});


class EmlpoyeePage {
    TitlePage = "Danh sách khách hàng";
    FormMode = null;
    EmployeeIdSelected = null;
    constructor() {
            this.loadData();
            this.intitEvents();
            // Ẩn hiện popup
            this.hidePopUp();
            // Load dữ liệu phòng ban
            this.loadDepartmentComboboxData();
            // Load dữ liệu vị trí
            this.loadPositionsComboboxData();
        }
        /**
         * Thực hiện load dữ liệu
         * Author: BAKACHAN (20/11/2021)
         */
    loadData() {

            // Lam sach bang
            $('#tbdlEmloyeesList tbody').empty();
            // Lấy dữ liệu:
            let employees = [];
            // Gọi lên api thực hiện lấy dữ liệu:

            $.ajax({
                type: "GET",
                url: "http://cukcuk.manhnv.net/api/v1/Employees",
                async: true,
                success: function(response) {
                    employees = response;
                    //Duyệt từng nhân viên trong mảng:
                    for (let e of employees) {
                        e.DateOfBirth = CommonJS.formatDate(e.DateOfBirth);
                        e.Salary = CommonJS.formatSalary(e.Salary)
                            // Build từng tr và append vào tbody của table:
                        let tr = $(`<tr>
                <td class="text-align-left">${e.EmployeeCode}</td>
                <td class="text-align-left">${e.FullName}</td>
                <td class="text-align-left">${e.GenderName}</td>
                <td class="text-align-center">${e.DateOfBirth}</td>
                <td class="text-align-center">${e.PhoneNumber}</td>
                <td class="text-align-left">${e.Email}</td>
                <td class="text-align-left">${e.PositionName}</td>
                <td class="text-align-left">${e.DepartmentName}</td>
                <td class="text-align-right">${e.Salary}</td>
                        </tr>`);
                        // Lưu trử khóa chính của dòng dữ liệu hiện tại: 
                        tr.data("employeeId", e.EmployeeId);
                        tr.data("data", e);
                        // Thêm tr vào trong bảng
                        $('#tbdlEmloyeesList tbody').append(tr);
                    }
                    $('.m-loading').hide();
                },
                error: function(res) {
                    alert("Co loi xay ra");
                }
            });
            // Xác định element sẽ hiện thị dữ liệu:
            let table = $('#tbdlEmloyeesList')
        }
        /**
         * Gán sự kiện cho các sự kiện có trong trang
         * author: Bakachan
         */

    intitEvents() {
        //Button Add:
        $("#m-btn-add-ele").click(this.btnAddOnClick.bind(this))


        //Button save:
        // $("#m-d-f-add").click(this.saveOnClick)
        $("#m-d-f-add").click(this.saveData.bind(this))
            //Row on click:

        //Row double click:
        // debugger
        $('table#tbdlEmloyeesList tbody').on('dblclick', 'tr', this.rowOnDblClick.bind(this));
        $('table#tbdlEmloyeesList tbody').on('click', 'tr', this.rowOnClick.bind(this));
        $('#m-c-s-r-delete').click(this.delete.bind(this))
    }

    /**
     * Ẩn form nhân viên khi nhấn vào button close và hủy
     * author: bakachan
     */
    hidePopUp() {
            // Ẩn
            $('#m-dialog-close').click(() => {
                $('#dlgPopup').hide();
            })

            $('#m-d-f-close').click(() => {
                $('#dlgPopup').hide();
            })
        }
        /**
         * Hiển thị form thêm mới nhân viên khi nhấn vào button add
         * author: bakachan
         */
    btnAddOnClick() {
            // Gán lại giá trị cho FormMode của EmployeePage:
            this.FormMode = Enum.FormMode.Add;
            //Clean các giá trị đã được nhập trước đó;
            // reset input
            $("input").val(null);

            // Lấy mã nhân viên mới và hiện thị lên ô nhập mã nhân viên
            $.ajax({
                type: "GET",
                url: "http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
                success: function(response) {
                    $("#m-employeeCode-txt").val(response);
                    // Focus vào ô nhập liệu đầu tiên
                    $("#m-employeeCode-txt").focus();
                }
            });
            // Hiện thị form thêm mới nhân viên
            $("#dlgPopup").show();



        }
        /**
         * Lưu thông tin nhân viên khi nhấn vào nút save
         * Author: Bakachan
         */
    saveOnClick() {
            // debugger
            // thu thập các thông tin
            const employeeCode = $("#m-employeeCode-txt").val();
            const employeeFullName = $("#m-employeeFullName-txt").val();
            const employeeGender = $("#m-employeeGender-txt").data('value');
            const employeeDateOfBirth = $("#m-employeeDateOfBirth-txt").val();
            const employeeDepartmentId = $("#m-employeeDepartmentId-txt").data('value');
            const employeeSalary = $("#m-employeeSalary-txt").val();
            const employeeEmail = $('#m-employeeEmail-txt').val();
            const employeePositionId = $('#m-employeePositionId-txt').data('value');
            const employeePhone = $('#m-employeePhone-txt').val();
            // Build thành object nhân viên
            let employee = {
                "EmployeeCode": employeeCode,
                "FullName": employeeFullName,
                "Gender": employeeGender,
                "DateOfBirth": employeeDateOfBirth,
                "DepartmentId": employeeDepartmentId,
                "Salary": employeeSalary,
                "Email": employeeEmail,
                "PositionId": employeePositionId,
                "PhoneNumber": employeePhone
            }

            // Sự dụng ajax gọi lên api rồi cất dữ liệu
            $.ajax({
                type: "POST",
                url: "http://cukcuk.manhnv.net/api/v1/Employees",
                data: JSON.stringify(employee),
                async: false,
                dataType: "json",
                contentType: "application/json",
                success: function(response) {
                    console.log(response);
                },
                error: function(reject) {
                    console.log(reject);
                }
            });

            // Ẩn form chi tiết
            $('#dlgPopup').hide();

        }
        /**
         * Chọn nhân viên khi nhấn vào dòng nhân viên
         * Author: Bakachan
         */
    rowOnClick(sender) {
            let currentRow = sender.currentTarget;
            let employeeId = $(currentRow).data('employeeId');
            this.EmployeeIdSelected = employeeId;
            $(currentRow).siblings().removeClass('m-row-selected');
            currentRow.classList.add('m-row-selected');
        }
        /**
         * Hiện thỉ form thông tin nhân viên khi nhấn vào đúp chuột vào 1 dòng dữ liệu
         * Author: Bakachan
         */

    rowOnDblClick(sender) {
            // debugger
            this.FormMode = Enum.FormMode.Update;
            let currentRow = sender.currentTarget;
            let employeeId = $(currentRow).data('employeeId');
            this.EmployeeIdSelected = employeeId;
            // Gọi api lấy dữ liệu chi tiết nhân viên:
            $.ajax({
                type: "GET",
                url: `http://cukcuk.manhnv.net/api/v1/Employees/${employeeId}`,

                success: function(e) {

                    // Binding du lieu vao form
                    // 1. Lấy toàn bộ các input sẽ biding dữ liệu -> có attribute [fieldName];
                    let inputs = $("input[fieldName]");
                    // 2. Duyệt từng input -> Lấy ra giá trị của attribute -> Để biết được sẽ map thông tin nào của đối tượng
                    for (const input of inputs) {
                        let fieldName = input.getAttribute("fieldName");
                        let value = e[fieldName];
                        if (value)
                            input.value = value;
                        else
                            input.value = null
                    }

                    // Hiện thị form chi tiết
                    $("#dlgPopup").show();

                }
            });


        }
        /**
         * lưu và sửa form thông tin nhân viên khi nhấn vào nút lưu
         * Author: Bakachan
         */
    saveData() {
            var me = this;
            // value dữ liệu: Kiểm tra dữ liệu có hợp lệ hay ko:

            // Thực hiện build object chi tiết thông tin khách hàng
            // 1. Lấy toàn bộ các input sẽ biding dữ liệu -> có attribute [fieldName];
            let inputs = $("input[fieldName]");
            // 2. Duyệt từng input -> Lấy ra giá trị của attribute -> Để biết được sẽ map thông tin nào của đối tượng
            let e = {};
            for (const input of inputs) {
                let fieldName = input.getAttribute("fieldName");
                let value = input.value;
                if (value)
                    e[fieldName] = value;

            }
            // Thực hiện cất dữ liệu => cần kiểm tra xem form ở trạng thái thêm mới hay là update để gọi api tương ứng
            if (this.FormMode == Enum.FormMode.Add) {
                $.ajax({
                    type: "POST",
                    url: "http://cukcuk.manhnv.net/api/v1/Employees",
                    data: JSON.stringify(e),
                    async: false,
                    dataType: "json",
                    contentType: "application/json",
                    success: function(response) {
                        console.log(e);
                        // Load lại dự liệu
                        me.loadData();
                        // Ẩn form chi tiết
                        $("#dlgPopup").hide();

                    }
                });
            } else {
                $.ajax({
                    type: "PUT",
                    url: `http://cukcuk.manhnv.net/api/v1/Employees/${this.EmployeeIdSelected}`,
                    data: JSON.stringify(e),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(response) {
                        // Load lại dự liệu
                        me.loadData();
                        // Ẩn form chi tiết
                        $("#dlgPopup").hide();
                    }
                });
            }
        }
        /**
         * Xóa 1 dòng thông tin nhân viên  khi nhấn vào nút xóa
         * Author: Bakachan
         */
    delete(sender) {
        var me = this;
        // Lấy ra id của bản ghi vừa chọn
        let employeeId = this.EmployeeIdSelected;
        // Gọi api thực hiện xóa
        $.ajax({
            type: "DELETE",
            url: `http://cukcuk.manhnv.net/api/v1/Employees/${this.EmployeeIdSelected}`,

            success: function(response) {
                $('#m-toast-error').fadeIn(1000);
                $('#m-toast-error').fadeOut(3000);
                me.loadData();
            }
        });
    }

    // load dữ liệu cho combobox phòng ban
    loadDepartmentComboboxData() {
        // Lấy dữ liệu về
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Departments",
            success: function(response) {
                // Buid combobox
                for (const department of response) {
                    // let optionHTML = `<option value="${department.DepartmentId}">${department.DepartmentName}</option>`;
                    let optionHTML = `<div class="m-combobox-item" value="${department.DepartmentId}">${department.DepartmentName}</div>`
                    $("#m-employeeDepartmentId-txt .m-combobox-data").append(optionHTML);
                }
            }
        });
    }

    loadPositionsComboboxData() {
        // Lấy dữ liệu về
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Positions",
            success: function(response) {
                // Buid combobox
                for (const positions of response) {
                    // let optionHTML = `<option value="${department.DepartmentId}">${department.DepartmentName}</option>`;
                    let optionHTML = `<div class="m-combobox-item" value="${positions.PositionId}">${positions.PositionName}</div>`
                    $("#m-employeePositionId-txt .m-combobox-data").append(optionHTML);
                }
            }
        });
    }
}