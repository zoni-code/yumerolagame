class TwitterUtil {

    private static readonly baseUrl: string = "http://twitter.com/share?text=";
    private static readonly targetUrl: string = "http://www.example.com";

    public static openTweetWindow(isClear: boolean, time: number) {
        const url = TwitterUtil.baseUrl + this.createText(isClear, time) + "&url=" + encodeURI(this.targetUrl)
        window.open(url, "tweet", 'width=650, height=470')
    }

    private static createText(isClear: boolean, time: number) {
        return `${isClear ? "クリア" : "失敗"} ${time}`;
    }
}

export default TwitterUtil;
