//= require compiled/BooksData
//= require search

/*
  ページが読み込まれた後に，titleSearch() に二つの引数を渡して実行する。

  author: 作者名を格納
  title:  タイトルを格納
*/
$(window).load(function(){
    bd = new BooksData();
    tb = new TopBook();

    var author = '池井戸潤';
    var title = '恋愛';
    var isbn = '9784863367012';
    titleSearch(title, 0);
    // authorSearch(author, 0);
    // genreSearch(genreId, 0);
    // isbnSearch(isbn, 0);
});

// クリックした表紙をトップへ移動する
$(document).ready(function() {
    $('#photos_6').click(function(){

        var id = event.target.id;
        tb.setUrl(bd.getUrl(id));
        tb.setImg(bd.getImg(id));
        tb.setTitle(bd.getTitle(id));
        tb.setAuthor(bd.getAuthor(id));
        tb.setCaption(bd.getCaption(id));

        var url = tb.getUrl();
        var src = tb.getImg().replace(/\?.*$/, '');
        var title = tb.getTitle();
        var author = tb.getAuthor();
        var caption = tb.getCaption();

        var top = '<div class="iconBuyButtonTop">'
            + '<p><img src="'
            + src
            + '"></p>'
            + '<a href="'
            + url
            + '" target="_blank">'
            + '<i class="fa fa-shopping-cart fa-fw fa-border" aria-hidden="true"></i>'
            + '</a></div>';
        $('#photos_1').html(null);
        $('#photos_1').html(top);

        // 履歴を上に残す
        tohistory(src);

        // タイトル検索
        $('#photos_6').html(null);
        var searchTitle = title.slice(0,2);
        titleSearch(searchTitle, 0);

        // タイトル追加
        $('.title').html(null);
        $('.title').append(title);

        // 作者追加
        var authorHtml = '<a href="#" name="' + author + '">'
            + '<i class="fa fa-user-circle-o" aria-hidden="true"></i>' + author + '</a>';
        $('.author').html(null);
        $('.author').append(authorHtml);

        // あらすじ追加
        var captionHtml = '<p class="red bold">'
            + caption
            + '<br /></p>'
            + '<p><a id="modal-close" class="button-link">閉じる</a></p>';
        $('#modal-content-innar').html(null);
        $('#modal-content-innar').append(captionHtml);

        // 履歴情報の保存
        var apple = src;
        // historySearch(apple);
        historyStorage(apple);
    });
});

function tohistory(src) {
    $('#display_history').append(
        '<img src="'+ src +'" width="90px" height="auto">'
    );
}

//履歴imgをクリックした時の処理
$(document).ready(function() {
    $('#display_history').click(function() {
        var src = event.target.src;

        var top =
            '<p>'
            + '<img src="'
            + src
            + '">'
            + '</p>'

        $('#photos_1').html(null);
        $('#photos_1').html(top);

        $('#photos_6').html(null);
        // タイトルの頭二文字を抽出
        var title = tb.getTitle().slice(0,2);
        titleSearch(title, 0);

        //タイトル追加
        var title_html = tb.getTitle();
        $('.title').html(null);
        $('.title').append(title_html);

        //作者追加
        var author_html = tb.getAuthor();
        $('.author').html(null);
        $('.author').append('<a href="#" name="'+ author_html +'">'
                            +'<i class="fa fa-user-circle-o" aria-hidden="true"></i>' + author_html + '</a>'
                           );

        //あらすじ追加
        var caption_html = tb.getCaption();
        $('#modal-content-innar').html(null);
        $('#modal-content-innar').append(
            '<p class="red bold">'
                + caption_html
                + '<br /></p>'
                + '<p><a id="modal-close" class="button-link">閉じる</a></p>'
        );
    });
});

$(document).ready(function() {
    $('.author').click(function() {
        var author = event.target.name;
        $('#photos_6').html(null);
        authorSearch(author, 0);
    })
});

// クリックされた変数をsessionに保存する
function historySearch(fruit) {
    historyStorage(fruit).done(function(data){
        $('.apple').append('hoge');
        console.log('hoge');
        outFruit(data);
    }).fail(function(data){
        //$('#out').html('<p>Failure</p>');
    });
}

function historyStorage(fruit) {
    return $.ajax({
        url: '/home_history',
        type: 'GET',
        dataType: 'json',
        async: true,
        data: {
            fruit: fruit
        }
    });
}

$(function(){
    $("#photos_1").click(function(){
        //キーボード操作などにより、オーバーレイが多重起動するのを防止する
        $( this ).blur() ;	//ボタンからフォーカスを外す
        if( $( "#modal-overlay" )[0] ) return false ;		//新しくモーダルウィンドウを起動しない (防止策1)
        //if($("#modal-overlay")[0]) $("#modal-overlay").remove() ;		//現在のモーダルウィンドウを削除して新しく起動する (防止策2)
        //オーバーレイを出現させる
        $( "body" ).append( '<div id="modal-overlay"></div>' ) ;
        $( "#modal-overlay" ).fadeIn( "slow" ) ;
        //コンテンツをセンタリングする
        centeringModalSyncer() ;
        //コンテンツをフェードインする
        $( "#modal-content" ).fadeIn( "slow" ) ;
        //[#modal-overlay]、または[#modal-close]をクリックしたら…
        $( "#modal-overlay,#modal-close" ).unbind().click( function(){
            //[#modal-content]と[#modal-overlay]をフェードアウトした後に…
            $( "#modal-content,#modal-overlay" ).fadeOut( "slow" , function(){
                //[#modal-overlay]を削除する
                $('#modal-overlay').remove() ;
            } ) ;
        } ) ;
    } ) ;
    //リサイズされたら、センタリングをする関数[centeringModalSyncer()]を実行する
    $( window ).resize( centeringModalSyncer ) ;
    //センタリングを実行する関数
    function centeringModalSyncer() {
        //画面(ウィンドウ)の幅、高さを取得
        var w = $( window ).width() ;
        var h = $( window ).height() ;
        // コンテンツ(#modal-content)の幅、高さを取得
        // jQueryのバージョンによっては、引数[{margin:true}]を指定した時、不具合を起こします。
        var cw = $( "#modal-content" ).outerWidth( {margin:true} );
        var ch = $( "#modal-content" ).outerHeight( {margin:true} );
        var cw = $( "#modal-content" ).outerWidth();
        var ch = $( "#modal-content" ).outerHeight();
        //センタリングを実行する
        $( "#modal-content" ).css( {"left": ((w - cw)/2) + "px","top": ((h - ch)/2) + "px"} ) ;
    }
} ) ;

//セッション履歴削除関数
$(document).ready(function() {
    $('#rireki').click(function() {
        history_delete(1);
        $('#display_history').html(null);
    });
});

//履歴削除
function history_delete(one) {
    return $.ajax({
        url: '/home_history',
        type: 'GET',
        dataType: 'json',
        async: true,
        data: {
            number: one
        }
    });
}

$(document).ready(function() {
    $('#rireki_page').click(function() {
        $('#photos_1').html(null);
        $('#photos_6').html(null);
        $('#display_history').html(null);

        //var component = '<img src="'
        //+ gon.history_list +'">'
        //$('body').append(gon.history_list[0]);
        var michiru = '<div id="display_session"></div>';
        //$('').append(michiru);
        $('#photos_6').append('ハロー');
        $('#photos_6').append(gon.value);

    });
});
