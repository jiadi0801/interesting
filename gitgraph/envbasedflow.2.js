var graphConfig = new GitGraph.Template({
  colors: ["#9993FF", "#47E8D4", "#6BDB52", "#F85BB5", "#FFA657", "#F85BB5"],
  branch: {
    color: "#000000",
    lineWidth: 3,
    spacingX: 60,
    mergeStyle: "straight",
    showLabel: true, // display branch names on graph
    labelFont: "normal 10pt Arial",
    labelRotation: 0
  },
  commit: {
    spacingY: -30,
    dot: {
      size: 8,
      strokeColor: "#000000",
      strokeWidth: 4
    },
    tag: {
      font: "normal 10pt Arial",
      color: "yellow"
    },
    message: {
      color: "black",
      font: "normal 12pt Arial",
      displayAuthor: false,
      displayBranch: false,
      displayHash: false
    }
  },
  arrow: {
    size: 8,
    offset: 3
  }
});

var config = {
  template: graphConfig,
  mode: "extended",
  orientation: "horizontal"
};

var bugFixCommit = {
  messageAuthorDisplay: false,
  messageBranchDisplay: false,
  messageHashDisplay: false,
  message: "Bug fix commit(s)"
};

var stabilizationCommit = {
  messageAuthorDisplay: false,
  messageBranchDisplay: false,
  messageHashDisplay: false,
  message: "Release stabilization commit(s)"
};

let column = 0;
let col = {
  feature: [column++, column++, column++],
  master: column++,
  // release: [column++, column++, column++],
  production: column++,
}

let gitgraph = new GitGraph(config);
animate();

async function animate() {
  let boeY = 265, tceY = 325;
  drawTag('tag由scm编译成功后打上', 10, 360);
  let master = gitgraph.branch({
    name: 'BOE',
    column: col.master
  });
  master.commit({
    message: '记得BOE和TCE每个点都有被SCM打tag'
  });

  await sleep(100);
  drawTag('0.0.1.1', 20, boeY);

  await sleep();

  let production = gitgraph.branch({
    name: 'TCE',
    column: col.production
  });

  production.commit({
    tagColor: '#2eff35',
    message: 'grid panel ready'
  });

  await sleep(100);
  drawTag('0.0.2.0', 85, tceY);

  await sleep();

  master.commit({
    message: 'grid panel ready'
  });

  await sleep(100);
  drawTag('0.0.2.1', 115, boeY);

  await sleep();

  master.checkout();
  let feature1 = gitgraph.branch({
    parent: master,
    name: 'feature/add-menu',
    col: col.feature[0]
  });
  feature1.commit('step1');
  await sleep(200);
  feature1.commit('step2');

  await sleep();

  master.checkout();
  let feature2 = gitgraph.branch({
    parent: master,
    name: 'feature/add-header',
    col: col.feature[1]
  });
  master.checkout();
  let feature3 = gitgraph.branch({
    parent: master,
    name: 'feature/add-footer',
    col: col.feature[2]
  });

  feature2.commit('step1'); await sleep(200);
  feature2.commit('step2'); await sleep(500);
  feature3.commit('step3'); await sleep(200);
  feature2.commit('step1'); await sleep(500);
  feature3.commit('step2'); await sleep(200);

  await sleep(1000);

  master.commit('由没有在这个图绘制的feature merge而成');
  drawTag('0.0.2.2', 440, boeY);
  drawTag('（由不在图中的feature合并）', 320, boeY + 15, '#ccc');

  await sleep();

  production.checkout();
  master.merge(production, '定时推送到TCE');

  await sleep();
  drawTag('0.0.3.0', 470, tceY);
  drawTag('（管理者执行tce上线）', 420, tceY + 15, '#ccc');

  await sleep();

  feature2.checkout();
  master.merge(feature2, '也可以用rebase，记得在图中标出');

  drawTag('提交MR前merge(rebase)BOE分支', 420, 100, '#ccc');

  drawTag('发起MR', 520, 140, '#a240fb', 10);

  await sleep();

  feature3.checkout();
  master.merge(feature3, '发起mr到BOE');
  drawTag('发起MR', 540, 205, '#a240fb', 10);

  await sleep();

  master.checkout();
  feature2.merge(master, 'feature成功merge');
  drawTag('成功合并', 550, 160, '#a240fb', 10);
  drawTag('0.0.3.1', 560, boeY);

  await sleep();

  feature3.checkout();
  master.merge(feature3, '处理conflict');
  drawTag('合并者解决冲突', 600, 205, '#a240fb', 10);

  await sleep();

  master.checkout();
  feature3.merge(master, 'feature1成功merge');

  drawTag('成功合并', 620, 225, '#a240fb', 10);


  drawTag('0.0.3.2', 630, boeY);

  await sleep();

  production.checkout();
  master.merge(production, '主动合并到TCE');

  drawTag('0.0.4.0', 660, tceY);

  await sleep();
}

function sleep(time = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

function drawTag(tag, x, y, color = '#d83e3e', fontSize = 15) {
  const wrapper = document.getElementById('wrapper');
  const span = document.createElement('span');
  span.style.color = color;
  span.style.fontSize = fontSize + 'px';
  span.style.position = 'absolute';
  span.style.left = x + 'px';
  span.style.top = y + 'px';
  span.innerHTML = tag;
  wrapper.appendChild(span);
}
