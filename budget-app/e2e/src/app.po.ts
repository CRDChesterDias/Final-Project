import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.tagName('title')).getAttribute("innerText") as Promise<string>
  }
  getPageHeaderText(): Promise<string> {
    return element(by.id('pageheader')).getAttribute("innerText") as Promise<string>
  }

}
