const randomNumber = (min, max) => Math.random() * (max - min) + min;

const getTotalSelectedBalance = () => {
  const checked = document.querySelectorAll("input.rowCheckBox:checked");
  let bal = 0;
  for (let i of checked) {
    bal += Number(i.value);
  }
  return bal;
};

const getTotalSelectedRows = () => {
  const checked = document.querySelectorAll("input.rowCheckBox:checked");
  return checked.length;
};

const getTotalRows = () => {
  const debtsTable = document.getElementById("debtsTable");
  return debtsTable.children.length;
};

const updateCheckedBalanceTotal = () => {
  document.getElementById("checkedBalanceTotal").innerHTML =
    "$" + String(getTotalSelectedBalance().toFixed(2));
};

const updateCheckedRowCount = () => {
  document.getElementById("checkedRowCount").innerHTML = getTotalSelectedRows();
};

const updateTotalRowsCount = () => {
  document.getElementById("totalRowCount").innerHTML = getTotalRows();
};

const addRow = (rowData) => {
  const debtsTable = document.getElementById("debtsTable");
  const row = document.createElement("tr");
  const checkBlock = document.createElement("td");
  const creditorBlock = document.createElement("td");
  const firstnameBlock = document.createElement("td");
  const lastnameBlock = document.createElement("td");
  const minpayBlock = document.createElement("td");
  const balanceBlock = document.createElement("td");

  const checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.setAttribute("value", rowData.balance);
  checkBox.classList.add("rowCheckBox");

  checkBox.addEventListener("change", (event) => {
    updateCheckedRowCount();
    updateCheckedBalanceTotal();
  });

  checkBlock.appendChild(checkBox);
  creditorBlock.appendChild(document.createTextNode(rowData.creditorName));
  firstnameBlock.appendChild(document.createTextNode(rowData.firstName));
  lastnameBlock.appendChild(document.createTextNode(rowData.lastName));
  minpayBlock.appendChild(
    document.createTextNode(rowData.minPaymentPercentage)
  );
  balanceBlock.appendChild(document.createTextNode(rowData.balance.toFixed(2)));

  row.appendChild(checkBlock);
  row.appendChild(creditorBlock);
  row.appendChild(firstnameBlock);
  row.appendChild(lastnameBlock);
  row.appendChild(minpayBlock);
  row.appendChild(balanceBlock);

  debtsTable.appendChild(row);
};

window.addEventListener("load", async () => {
  const { data } = await axios.get('/api');
  data.map(async (item) => {
    addRow(item);
  });
  updateTotalRowsCount();

  document.getElementById("addDebtButton").addEventListener("click", () => {
    const item = {
      //"id": 1,
      creditorName: "EX_creditorName",
      firstName: "EX_firstName",
      lastName: "EX_lastName",
      minPaymentPercentage: randomNumber(2, 5).toFixed(1),
      balance: randomNumber(500, 5000),
    };
    addRow(item);
    updateTotalRowsCount();
  });

  document.getElementById("removeDebtButton").addEventListener("click", () => {
    const debtsTable = document.getElementById("debtsTable");
    if (debtsTable.children.length > 0) {
      debtsTable.children[debtsTable.children.length - 1].remove();
      updateTotalRowsCount();
      updateCheckedRowCount();
      updateCheckedBalanceTotal();
    }
  });

  window.finishedLoading = true; 
});
