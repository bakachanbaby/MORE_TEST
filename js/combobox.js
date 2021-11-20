$(document).ready(function() {
    // Khởi tạo sự kiện cho button của combobox
    $(".mcombobox .m-combobox-button").click(btnComboboxOnclick);
    $(".mcombobox .m-combobox-item").click(itemComboboxOnclick);
    $(".mcombobox").on('click', '.m-combobox-item', itemComboboxOnclick);
    $(".mcombobox input").keydown(inputComboboxOnKeyDown);
    $(".mcombobox input").keyup(inputComboboxOnKeyUp);

    // Lưu trữ thông tin của combobox data:
    // let comboboxs = $('.m-combobox');
    // for(const combobox of comboboxs) {
    //     let itemDataElements = $(combobox).find('m-combobox-data').html();
    //     $(combobox).data('itemDataElement', itemDataElements);
    //     $(this).siblings('.m-combobox-data')
    // } 
})

function inputComboboxOnKeyUp() {
    // $(this).siblings('.m-combobox-data').empty();
    // let itemDataElement = $(this.parentElement).data('itemDataElement');

    // $(this).siblings('.m-combobox-data').html(itemDataElement);
    // let itemDataElementHTML = $(itemDataElement).filter(function(e) {return e.nodeType != 3});
    // for (const item of itemDataElement) {
    //     if(item.nodeType == 3) {
    //         item.remove();
    //     }
    // }
    // Thực hiện lọc dữ liệu trong data item:
    // 1. Lấy value đã nhập trên input:
    const valueInput = this.value;
    // $('.m-combobox-data .m-combobox-item').filter(function() {
    //     $(this).toggle($(this).text().toLowerCase().indexOf(valueInput) > -1);
    // });

    // 2. Duyệt từng item và thực hiện kiểm tra xem element nào có value hợp lệ
    let items = $(this).siblings('.m-combobox-data').children();
    for (const item of items) {
        debugger
        let text = item.textContent;
        if (!text.toLowerCase().includes(valueInput.toLowerCase())) {
            item.remove();
        }
        debugger
    }
    $(this).siblings('.m-combobox-data').show();
}

function inputComboboxOnKeyDown() {
    // Hiển thị data của combobox:

    // Lấy tất cả item element trong data
    let items = $(this).siblings('.m-combobox-data').children();

    // Kiểm tra xem có item nào đã ở trạng thái đã được hover chưa:
    let itemHoverred = items.filter('.m-combobox-item-hover');

    // Bỏ hover tất cả các iteam đã được set trước đó:
    // $(items).removeClass('m-combobox-item-hover');

    switch (event.keyCode) {
        case 13: // Khi nhấn phím enter
            // Nếu có item nào đó đã được chọn, thì lấy text -> gán cho input, value -> gán cho combobox
            if (itemHoverred.length == 1) {
                itemHoverred = itemHoverred[0];
                let text = $(itemHoverred).text();
                let value = $(itemHoverred).attr('value');
                // 3. Gán text vào input của combobox
                // Tìm đến element parent đầu tiên
                let parentItem = $(itemHoverred).parent();
                // tìm đến anh em của parent là input và gán text
                parentItem.siblings('.m-combobox-input').val(`${text}`);

                // 4. Gán value cho combobox
                let comboboxElement = $(itemHoverred).parents('.mcombobox');
                // Cách 1: thực hiện lưu value vào attribute của element
                // comboboxElement.attr("value", value);
                // Cách 2: gán vào data của element
                comboboxElement.data("value", value);

                // Ẩn conbobox data
                $(parentItem).hide();
            }
            break;

        case 40: // nhấp mũi tên xuống trên bàn phím
            // Nếu đã có item được chọn trước đó thì hover tới item kết tếp:
            if (itemHoverred.length > 0) {
                // Lấy item kế tiếp:
                let nextElement = itemHoverred.next();
                // Thêm class hover cho item kế tiếp:
                nextElement.addClass('m-combobox-item-hover');
                // Xóa class hover của item hiện tại:
                itemHoverred.removeClass('m-combobox-item-hover');
            } else {
                // Nếu chưa có iteam nào được chọn trước đó thì mặc định chọn item đầu tiên
                $(this).siblings('.m-combobox-data').show();
                let firstItem = items[0];
                $(firstItem).addClass("m-combobox-item-hover");
            }

            break;
        case 38: // nhấn mũi tên lên trên bàn phím
            // Nếu đã có item được chọn trước đó thì hover tới item trước nó:
            if (itemHoverred.length > 0) {
                // Lấy item trước nó:
                let prevElement = itemHoverred.prev();
                // Thêm class hover cho item trước nó:
                prevElement.addClass('m-combobox-item-hover');
                // Xóa class hover của item hiện tại:
                itemHoverred.removeClass('m-combobox-item-hover');
            } else {
                // Nếu chưa có iteam nào được chọn trước đó thì mặc định chọn item cuối cùng
                $(this).siblings('.m-combobox-data').show();
                let lastItem = items[items.length - 1];
                $(lastItem).addClass("m-combobox-item-hover");
            }

            break;
        default:
            break;
    }

}

function btnComboboxOnclick() {
    // Ẩn/Hiện combobox data
    $(this).siblings('.m-combobox-data').toggle();
}

function itemComboboxOnclick() {
    // Hiển thị text ở item vừa chọn lên input của combobox
    // 1. Lấy text trong item vừa chọn
    const text = $(this).text();

    // 2. Lấy ra value của iteam vừa chọn
    const value = $(this).attr("value");

    // 3. Gán text vào input của combobox
    // Tìm đến element parent đầu tiên
    let parentItem = $(this).parent();
    // tìm đến anh em của parent là input và gán text
    parentItem.siblings('.m-combobox-input').val(`${text}`);

    // 4. Gán value cho combobox
    let comboboxElement = $(this).parents('.mcombobox');
    // Cách 1: thực hiện lưu value vào attribute của element
    // comboboxElement.attr("value", value);
    // Cách 2: gán vào data của element
    comboboxElement.data("value", value);

    // Ẩn conbobox data
    $(parentItem).hide();
}