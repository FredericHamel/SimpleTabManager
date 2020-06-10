
(function () {

  function get_all_tabs(k) {
    let queryTabs = browser.tabs.query( { currentWindow : true });
    queryTabs.then(k).catch((e) => alert(e));
  }

  function deleteTab(id) {
    browser.tabs.remove(id).then(() => {
      let divId = 'tab' + id;
      let div = document.getElementById(divId);
      div.parentElement.removeChild(div);

      let tabCountSpan = document.getElementById('tabCount');
      tabCountSpan.value = (+tabCountSpan.value) + 1;
    });
  }

  function selectTab(id, index) {
    browser.tabs.highlight({ tabs: [index] }).then((win) => {
      // noop
    }).catch((err) => {
      alert(err);
    });
  }

  function updateSelectedButton(id) {
      let selectedTabSpan = document.getElementById('selectedTab');
      let lastSelectBtn = document.getElementById('selectBtn' + selectedTabSpan.value);
      lastSelectBtn.disabled = false;

      let selectBtn = document.getElementById('selectBtn' + id);
      selectBtn.disabled = true;

      selectedTabSpan.value = id;
  }

  function createTabEntry(tab) {
    let divId = 'tab' + tab.id;
    let div = document.createElement('div');

    let ul = document.createElement('ul');
    let title = document.createElement('li');
    let url = document.createElement('li');

    let selectButton = document.createElement('input');
    let delButton = document.createElement('input');

    selectButton.type = 'button';
    selectButton.value = 'Select';
    selectButton.onclick = () => selectTab(tab.id, tab.index);
    selectButton.id = 'selectBtn' + tab.id;
    selectButton.disabled = tab.active;

    delButton.type = 'button';
    delButton.value = 'Delete';
    delButton.onclick = () => deleteTab(tab.id);

    title.innerText = tab.title;
    url.innerText = tab.url;
    ul.appendChild(title);
    ul.appendChild(url);

    div.id = divId;
    div.className = 'tabElement';
    div.appendChild(ul);
    div.appendChild(selectButton);
    div.appendChild(delButton);
    return div;
  }

  browser.tabs.onHighlighted.addListener((highlightInfo) => {
    try {
      let id = highlightInfo.tabIds[0];
      updateSelectedButton(id);
    } catch (e) {
      alert(e);
    }
  });

  let content = document.getElementById('content');
  let span = document.getElementById('selectedTab');

      //<p>Number of tabs: <span id="tabCount"></span></p>
  get_all_tabs((tabs) => {
    let paragraph = document.createElement('p');
    let textNode = document.createTextNode('Number of tabs: ');
    let tabCountSpan = document.createElement('span');

    tabCountSpan.id = 'tabCount';
    tabCountSpan.innerText = tabs.length;

    paragraph.appendChild(textNode);
    paragraph.appendChild(tabCountSpan);

    content.appendChild(paragraph);

    for (let i in tabs) {
      let ul = createTabEntry(tabs[i]);
      if (tabs[i].active) {
        content.insertBefore(ul, paragraph.nextSibling)
        span.value = tabs[i].id;
      } else {
        content.appendChild(ul);
      }
    }
  });
})();
