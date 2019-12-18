const baseElement = {
  type: "div",
  props: {
    id: "container",
    children: [
      { type: "input", props: { value: "foo", type: "text" } },
      { type: "a", props: { href: "/bar" } },
      { type: "span", props: {} }
    ]
  }
}

const baseRoot = document.getElementById('baseRender');
function baseRender(element, parentNode = baseRoot) {
  let {type, props} = element;
  let dom = document.createElement(type);
  if (props.children) {
    props.children.forEach(child => {
      baseRender(child, dom);
    });
  }
  parentNode.appendChild(dom);
}
baseRender(baseElement);

const eventElement = {
  type: "div",
  props: {
    id: "container",
    children: [
      { type: "input", props: {placeholder: 'hello' } },
      { type: "button", props: { onClick: () => alert(234)} },
      { type: "button", props: { onClick: testFun} }
    ]
  }
}
function testFun() {
  alert('testfun')
}
const eventRoot = document.getElementById('eventRender');
function eventRender(element, parentNode = eventRoot) {
  let {type, props} = element;
  let dom = document.createElement(type);
  
  let isListener = name => name.startsWith('on'); // filter callback
  Object.keys(props).filter(isListener).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, props[name]);
  })
  
  let isAttribute = name => !name.startsWith('on') && name !== 'children';
  Object.keys(props).filter(isAttribute).forEach(name => {
    dom[name] = props[name];
  })
  
  if (props.children) {
    props.children.forEach(child => {
      eventRender(child, dom);
    });
  }
  parentNode.appendChild(dom);
}
eventRender(eventElement);

const txtElement = {
    type: "button", 
    props: { 
      onClick: testFun,
      // 为什么文本不直接children: 'click me'?
      // 因为以以下的形式，文本类型不需要再添加更多的逻辑，nodevalue和其他prop一样，直接添加到了textnode上面了
      // 素晴らしです！
      children: [
        {
          type: 'TEXT ELEMENT',
          props: { nodeValue: 'click me'}
        }
      ]
    } 
}

const txtRoot = document.getElementById('txtRender');
function txtRender(element, parentNode = txtRoot) {
  let {type, props} = element;
  
  const isTextElement = type === "TEXT ELEMENT"; // 文本类型判定
  console.log(isTextElement)
  
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(type);
  
  let isListener = name => name.startsWith('on'); // filter callback
  Object.keys(props).filter(isListener).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, props[name]);
  })
  
  let isAttribute = name => !name.startsWith('on') && name !== 'children';
  Object.keys(props).filter(isAttribute).forEach(name => {
    dom[name] = props[name];
  })
  
  if (props.children) {
    props.children.forEach(child => {
      txtRender(child, dom);
    });
  }
  parentNode.appendChild(dom);
}
txtRender(txtElement);