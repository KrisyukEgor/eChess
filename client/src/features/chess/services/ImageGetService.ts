import type { Figure } from "../../../../chess/src/Core/Figures/Figure";


export class ImageGetService {
    
    private static readonly base_url = "";
    public static getImageUrl(figure: Figure) {
        const name = figure.name.toLowerCase();
        const color = figure.color.toLowerCase();

        const fileName = `${color}-${name}.png`;
        return this.base_url + '/' + fileName;
    }
}