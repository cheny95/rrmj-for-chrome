$(document).ready(function () {

    var seasonId;
    var seasonTitle;

    var videohandler = function (index, element) {
        var id = "episod" + index;
        $("#list").append("<li class=\"list-group-item list-group-item-warning\"  id=\"" + id + "_li\" >" + seasonTitle + " 第" + element.episode + "集</li>");

        // $("#" + id).click(function () {
        $.ajax({
            type: 'POST',
            url: "http://api.rrmj.tv/video/findM3u8ByEpisodeSid",
            data: "seasonId=" + seasonId + '&episodeSid=' + element.sid + '&quality=high',
            headers: {
                "clientVersion": "99.99"
            },
            success: function (data) {
                if (data.code = "0000" && data.data.m3u8) {
                    $("#" + id + "_li").append("<a class='text-danger playStyle playV" + index + "' data-src ='" + data.data.m3u8.url + "' data-title='" + seasonTitle + element.episode + "'  target='_blank' href='" + data.data.m3u8.url + "'> <span class='label label-danger'>Play</span> </a>");
                }
            }
        });
        // })
    };

    var liHandler = function (index, element) {

        console.log(element.title);
        var id = "episod" + index;
        var brief;
        if (element.brief) {
            brief = element.brief.length > 100 ? element.brief.slice(0, 100) + '...' : element.brief
        } else {
            brief = '暂无简介';
        }
        $("#list").append("<div class=\"list-group list-group-item-warning\">" +
            "  <a href=\"#\" class=\"list-group-item active\" id=\"" + id + "\">" +
            "    <h3 class=\"list-group-item-heading\">" + element.title + "</h3>" +
            "    <p class=\"list-group-item-text text-left\">" + brief + "</p>" +
            "  </a>" +
            "</div>"
        );
        var epHandler = function () {
            seasonTitle = $(this).find('h3').html();
            seasonId = element.id;
            $.ajax({
                type: 'POST',
                url: "http://api.rrmj.tv/season/detail/",
                data: "seasonId=" + element.id,
                headers: {
                    "clientVersion": "99.99"
                },
                success: function (data) {
                    console.log(data);
                    $("#list").empty();
                    $.each(data.data.season.episode_brief, videohandler);
                }
            })
        };
        $("#" + id).click(epHandler)
    };


    var handler = function (e) {
        var keyword = $("#stxt").val();
        if (keyword.length < 1) {
            $("#list").html("<li class=''><span class='text-center text-warning'>请好好输入，不要搞事情…</span></li>");
            return false;
        }
        $.ajax({
            type: 'POST',
            url: "http://api.rrmj.tv/season/search/",
            data: "page=1&rows=20&name=" + keyword,
            headers: {
                "clientVersion": "99.99"
            },
            success: function (data) {
                console.log(data);
                $("#list").empty();
                if (data.data.results.length < 1) {
                    $("#list").html("<li class=''><span class='text-center text-warning'>没有搜索到…</span></li>");
                    return false;
                }
                $.each(data.data.results, liHandler);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error');
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    };
    $("#sbtn").click(handler);
    $("#stxt").keypress(function (e) {
        var keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode == 13) {
            handler();
        } else {
        }
    });
});
