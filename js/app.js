$(document).ready(function() {
    loadData();
    addEmployee();
});

function showLoading() {
    $('.m-loading').show();
}

function loadData() {
    // Lam sach bang
    $('#tbdlEmloyeesList tbody').empty();
    // Lấy dữ liệu:
    let employees = [];
    console.table("Chang 1");
    // Gọi lên api thực hiện lấy dữ liệu:

    $.ajax({
        type: "GET",
        url: "http://cukcuk.manhnv.net/api/v1/Employees",
        async: true,
        success: function(response) {
            employees = response;
            for (let e of employees) {
                let dateOfBirth = e.DateOfBirth;
                dateOfBirth = new Date(dateOfBirth);
                let date = dateOfBirth.getDate();
                date = (date < 10 ? `0${date}` : date);
                let month = dateOfBirth.getMonth() + 1;
                month = (month < 10 ? `0${month}` : month);
                let year = dateOfBirth.getFullYear();
                dateOfBirth = `${date}/${month}/${year}`;
                e.Salary = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(e.Salary);
                let tr = `<tr>
                <td class="text-align-left">${e.EmployeeCode}</td>
                <td class="text-align-left">${e.FullName}</td>
                <td class="text-align-left">${e.GenderName}</td>
                <td class="text-align-center">${dateOfBirth}</td>
                <td class="text-align-center">${e.PhoneNumber}</td>
                <td class="text-align-left">${e.Email}</td>
                <td class="text-align-left">${e.PositionName}</td>
                <td class="text-align-left">${e.DepartmentName}</td>
                <td class="text-align-right">${e.Salary}</td>
                        </tr>`
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

function addEmployee() {
    // show
    $("#m-btn-add-ele").click(function() {


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

        $("#dlgPopup").show();
    });

    // Ẩn
    $('#m-dialog-close').click(() => {
        $('#dlgPopup').hide();
    })

    $('#m-d-f-close').click(() => {
        $('#dlgPopup').hide();
    })

    // Thêm nhân viên
    $("#m-d-f-add").click(function() {
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

        // Refresh lại dữ liệu
        loadData();

    });

    // Load dữ liệu cho các combobox:
    // Load dữ liệu phòng ban
    loadDepartmentComboboxData();
    // Load dữ liệu vị trí
    loadPositionsComboboxData();
}


// load dữ liệu cho combobox phòng ban
function loadDepartmentComboboxData() {
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

function loadPositionsComboboxData() {
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