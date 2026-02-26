
class CardAppDto {
    title: string = ""
    appName: string = ""
    isFavorite: boolean = false;
    onUpdate!: (app: any) => void;

    constructor(title: string = "", appName: string = "", isFavorite: boolean = false) {
        this.title = title;
        this.appName = appName;
        this.isFavorite = isFavorite;
    }
}

export default CardAppDto;