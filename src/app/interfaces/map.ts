import { DxVectorMapComponent } from 'devextreme-angular';
import dxVectorMap, {
  MapLayer,
  MapLayerElement,
} from 'devextreme/viz/vector_map';

/**
 * a class that handles the VectorMap instance
 */
export class Map {
  private Elements: MapLayerElement[];
  private Instance: dxVectorMap;

  constructor(private vectorMap: DxVectorMapComponent) {
    this.Instance = this.vectorMap.instance;
    this.Elements = this.Instance.getLayerByIndex(0).getElements();
  }

  hideLoadingIndicator() {
    this.Instance.hideLoadingIndicator();
  }

  /**
   *set country status on the map
   * @param country
   * @param status
   */
  setCountryStatus(country: string, status: number ,info?:string) {
    this.Elements.forEach((element) => {
      if (element.attribute('name') == country) {
        element.attribute('total', status); // change the degree of openness of the country
        element.attribute('info', info || "No info");
        element.applySettings({});
      }
    });
  }

  /**
   * updates a list of countries at once
   * @param countryies
   * @param status
   */
  setCountriesStatus(countryies: string[], status: number, info?:string) {
    this.Elements.forEach((element) => {
      if (element.attribute('name') in countryies) {
        element.attribute('total', status); // change the degree of openness of the country
        element.attribute('info', info || "No info");
        element.applySettings({});
      }
    });
  }

  /**
   *  set all countries to the same status
   * @param status
   * @param except optional country that will not be updated
   */
  setAllCountries(status: number, except?: string) {
    this.Elements.forEach((element) => {
      if (element.attribute('name') !== except) {
        element.attribute('total', status); // change the degree of openness of the country
        element.applySettings({});
      }
    });
  }

  /**
   * reset all the map to undefinied
   */
  resetMap() {
    this.setAllCountries(5);
  }
}
