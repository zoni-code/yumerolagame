class StringUtil {

    public static toDisplayTimeFormat(elapsedTime: number) {
        return ((elapsedTime / 1000).toString().toString() + "0").slice(0, -3);
    }
}

export default StringUtil;
