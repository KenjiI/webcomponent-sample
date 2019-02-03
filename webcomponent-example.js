class MyButton extends HTMLElement {
  constructor() {
    super();
    console.log('constructor');

    // shadowdom を使えるように
    // mode: closed の場合は、selector などで中の要素をさわれない
    // shadowmRoot が null でかえる。そのため、webcomponent 自身
    // の中でも this.shadowRoot.innerHTML と言ったことはできない
    // shadowdomRoot への参照を保持する必要がある
    this.attachShadow({ mode: "open" });
    // shadowdom のルートにHTMLを設定
    this.shadowRoot.innerHTML = `
      <style>
        button {
          border: none;
          border-radius: 3px;
          padding: 10px 20px;
          color: #fff;
          background-color: var(--bkcolor);
        }
      </style>
      <button type="button">${this.innerHTML}</button>
    `;
  }

  static get observedAttributes() {
    // 監視する属性を設定する
    // <my-button label="" > みたいな感じで、label の値が変わるとイベントが起きる
    // -> attributeChangedCallback
    return [ 'label' ];
  }

  connectedCallback() {
    // 要素がdocumentに追加された時に呼ばれる
    console.log('connectedCallback');
  }

  disconnectedCallback() {
    // 要素がdocumentから削除された時に呼ばれる
    console.log('disconnectedCallback');
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    console.log(`attributeChangedCallback: ${attributeName}, ${oldValue}, ${newValue}, ${namespace}`);
    this.shadowRoot.querySelector("button").textContent = newValue;
  }

  adoptedCallback(oldDocument, newDocument) {
    console.log('adoptedCallback');
  }
}

customElements.define("my-button", MyButton);

////////////////////////////////////////////

class MyList extends HTMLElement {
  constructor() {
    super();
    console.log('constructor');

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
      .root {
        border: 1px solid #aaa;
        border-radius: 0.81rem;
        overflow: hidden;
      }
      button {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        padding: 0 20px;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 3px 0 rgba(0,0,0,0.1);
        background: #25c04a;
        letter-spacing: 0.025em;
        text-align: center;
        text-decoration: none;
        color: #fff;
        border: 1px solid #25c04a;
        transition: background-color .35s,color .35s;
      }
      .button:hover {
        background: #fff;
        color: #25c04a;
      }
      table {
        border-collapse:  collapse;
        width: 100%;
      }
      tr:nth-child(odd) {
          background-color:  #ddd;
      }
      th,td {
          padding: 5px 10px;
          text-align: left;
      }
      </style>
      <div class="root">
        <table>
          <tr><th>ファイル名</th><th>操作</th></tr>
          <tbody>
          </body>
        </table>
      </div>
    `;

    this.getDataFromExternal().then(fileList => {
      fileList.forEach(item => {
        // ラベル表示用の TD
        const tdLabelElem = document.createElement('td');
        tdLabelElem.textContent = item.label;

        // アクションボタン用の TD
        const tdButtonElem = document.createElement('td');
        const exeButton = document.createElement('button');
        exeButton.textContent = '実行';
        exeButton.setAttribute('data-id', item.id);
        exeButton.addEventListener('click', e => {
          alert(e.target.getAttribute('data-id'));
        });
        tdButtonElem.append(exeButton);

        // 1行に連結
        const trElem = document.createElement('tr');
        trElem.append(tdLabelElem);
        trElem.append(tdButtonElem);

        this.shadowRoot.querySelector("tbody").appendChild(trElem);
        // this.shadowRoot.querySelector("ul").appendChild(elem);
      });
    });
  }

  getDataFromExternal() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { id: 'id124', label: 'file name 1', updatedAt: '2019/02/01' },
          { id: 'id456', label: 'file name 2', updatedAt: '2019/02/01' },
          { id: 'id456', label: 'file name 3', updatedAt: '2019/02/01' },
          { id: 'id456', label: 'file name 4', updatedAt: '2019/02/01' },
          { id: 'id456', label: 'file name 5', updatedAt: '2019/02/01' },
        ]);
      }, 500);
    });
  }

  static get observedAttributes() {
    return [ ];
  }

  connectedCallback() {
    // 要素がdocumentに追加された時に呼ばれる
    console.log('connectedCallback');
  }

  disconnectedCallback() {
    // 要素がdocumentから削除された時に呼ばれる
    console.log('disconnectedCallback');
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    console.log(`attributeChangedCallback: ${attributeName}, ${oldValue}, ${newValue}, ${namespace}`);
  }

  adoptedCallback(oldDocument, newDocument) {
    console.log('adoptedCallback');
  }
}

customElements.define("my-list", MyList);
