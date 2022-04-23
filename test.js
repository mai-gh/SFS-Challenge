const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const jsonData = require('./data.json');
const axios = require('axios');

const srv = "http://127.0.0.1:3000"

const getDOM = async () => {
  const dom = await JSDOM.fromURL(srv, {runScripts: "dangerously", resources: "usable"})
  while (!dom.window.finishedLoading) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  return dom
}


describe('Back End Testing', () => {
  it("GET /", async () => {
    res = await axios.get(srv)
    expect(res.status).to.equal(200);
    expect(res.data.slice(0,15)).to.equal("<!DOCTYPE html>");
  })
  it("GET /api", async () => {
    res = await axios.get(srv + '/api')
    expect(res.status).to.equal(200);
    expect(res.data).to.be.a('array');
  })
  it("POST /api", async () => {
    res = await axios.post(srv + '/api', jsonData[5])
    expect(res.status).to.equal(204);
  })
  it("DELETE /api", async () => {
    res = await axios.delete(srv + '/api')
    expect(res.status).to.equal(204);
  })
})


describe('DOM testing', () => {
  let dom;
  beforeEach(async () => {
    dom = await getDOM();
  })

  describe('Initial Table & Data', () => {
    it("there is only one table", () => {
      expect(dom.window.document.getElementsByTagName("tbody").length).equals(1);
    })
  
    it("the table has 6 columns & their headings are correct", () => {
      expect(dom.window.document.getElementsByTagName("thead").length).equals(1);
      const headings = dom.window.document.getElementsByTagName("th");
      expect(headings.length).equals(6)
      expect(headings[0].textContent).equals("")
      expect(headings[1].textContent).equals("Creditor")
      expect(headings[2].textContent).equals("First Name")
      expect(headings[3].textContent).equals("Last Name")
      expect(headings[4].textContent).equals("Min Payment %")
      expect(headings[5].textContent).equals("Balance")
    })
  
    it("each row has a checkbox, each checkbox has correct values (balance)", () => {
      const allCheckBoxes = dom.window.document.getElementsByClassName("rowCheckBox")
      expect(allCheckBoxes.length).to.equal(jsonData.length)
      for (let i = 0; i < jsonData.length; i++) {
        expect(Number(allCheckBoxes[i].value)).to.equal(jsonData[i].balance);
      } 
    })
  
    it("loads the same amount of rows to the table as entries from json at start", () => {
      expect(dom.window.document.getElementsByTagName("tbody").item(0).children.length).equals(10)
    })
  });

  describe('Totals, Buttons and Interactions', () => {
    it("totals before adding or removing", () => {
      expect(dom.window.document.getElementById("checkedBalanceTotal").textContent).to.equal("$0.00")
      expect(Number(dom.window.document.getElementById("totalRowCount").textContent)).to.equal(jsonData.length)
      expect(dom.window.document.getElementById("checkedRowCount").textContent).to.equal("0")
    })
    it("add button", () => {
      dom.window.document.getElementById("addDebtButton").click()
      dom.window.document.getElementById("addDebtButton").click()
      dom.window.document.getElementById("addDebtButton").click()
      expect(dom.window.document.getElementsByTagName("tbody").item(0).children.length).equals(13)
    })
    it("remove button", () => {
      dom.window.document.getElementById("removeDebtButton").click()
      dom.window.document.getElementById("removeDebtButton").click()
      dom.window.document.getElementById("removeDebtButton").click()
      expect(dom.window.document.getElementsByTagName("tbody").item(0).children.length).equals(7)
    })

    it("checked checkboxes updates totals", () => {
      const allCheckBoxes = [ ...dom.window.document.getElementsByClassName("rowCheckBox") ];
      const jsonTotalBalance = jsonData.reduce((pv, cv) => pv + cv.balance, 0)
      allCheckBoxes.forEach(cb => cb.click())
      expect(dom.window.document.getElementById("checkedBalanceTotal").textContent).to.equal("$" + jsonTotalBalance + ".00")
      expect(Number(dom.window.document.getElementById("checkedRowCount").textContent)).to.equal(jsonData.length)
      dom.window.document.getElementById("removeDebtButton").click()
      expect(dom.window.document.getElementById("checkedBalanceTotal").textContent).to.equal("$" + (jsonTotalBalance - jsonData[jsonData.length - 1]['balance']) + ".00")
    })    
  });

})



