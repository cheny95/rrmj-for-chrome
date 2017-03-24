$(document).ready(function () {

    var seasonId;
    var seasonTitle;

    var videohandler = function (index, element) {
        var id = "episod" + index;
        var e = index + 1;
        var url = element.playLink;
        $("#list").append("<li class=\"list-group-item list-group-item-warning\"  id=\"" + id + "_li\" >" + seasonTitle + " 第" + e + "集</li>");

        $("#" + id + "_li").append("<span class='label label-info' id='play' style='margin:0 5px;'>点击播放</span> <a class='text-danger playStyle playV" + index + "' data-src ='" + url + "' data-title='" + seasonTitle + e + "'  target='_blank' href='" +url + "' style='margin:0 5px;'><span class='label label-danger'>浏览器播放</span></a>");

        $("#" + id + "_li #play").click(function () {
            if ($("#" + id + "_li #video") && $("#" + id + "_li #video").length > 0) {
                $("#" + id + "_li #video").remove();
                $("#" + id + "_li #resize").remove();
                return false;
            }
            $("#" + id + "_li").append("<span id='resize' style='margin-top:10px; display: block;'><botton class='btn btn-xs btn-default'>由于chrome机制，片源播放后请点我调整大小</botton></span>" +
                "<video src='" + url + "' autoplay='true' controls='true' id='video'></video>");
            $('#resize').click(function () {
                $('video').css({width: '370px', marginTop: '10px'})
            })
        })

    };

    var liHandler = function (index, element) {
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
                    $("#list").empty();
                    $.each(data.data.season.playUrlList, videohandler);
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
                $("#list").empty();
                if (data.data.results.length < 1) {
                    $("#list").html("<li class=''><span class='text-center text-warning'>没有搜索到…</span></li>");
                    return false;
                }
                $.each(data.data.results, liHandler);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    };
    $("#sbtn").click(handler);
    // $("#sbtn").click(resBaby);
    $("#stxt").keypress(function (e) {
        var keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode == 13) {
            handler();
        } else {
        }
    });
});
