import puppeteer from 'puppeteer'

export const pickValue = async (page: puppeteer.Page, xpath: string): Promise<string> => {
    const xPath = await page.$x(xpath)
    let str = await page.evaluate((element) => {
        return element.textContent
    }, xPath[0])
    return new Promise((resolve, reject) => {
        resolve(str)
    })
}

export const lenList = async (page: puppeteer.Page, xpath: string): Promise<number> => {
    const xPath = await page.$x(xpath)
    let len = await page.evaluate((element) => {
        return Array.from(element.children).length;
    }, xPath[0]);
    return new Promise((resolve, reject) => {
        resolve(len)
    })
}

export const convertStringPriceToDouble = (price: string, cents: string): number => {
    let priceInDouble = Number(price.replace(/\./g, ""));
    let centsInDouble = Number(cents);
    return priceInDouble + centsInDouble / 100;
}

export const delay = (time: number) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}