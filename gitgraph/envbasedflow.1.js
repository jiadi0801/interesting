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
  release: [column++, column++, column++],
}

let gitgraph = new GitGraph(config);

let master = gitgraph.branch({
  name: 'master',
  column: col.master
});

master.commit('initial commit').commit('config 1').commit('config 2');
master.commit({
  tag: '0.0.1',
  message: 'grid panel ready'
});

let feature1 = gitgraph.branch({
  parent: master,
  name: 'feature/add-menu',
  col: col.feature[0]
});
feature1.commit('step1').commit('step2');

master.checkout();
let feature2 = gitgraph.branch({
  parent: master,
  name: 'feature/add-header',
  col: col.feature[1]
});
feature2.commit('step1').commit('step2').commit('step3');

master.checkout();
let feature3 = gitgraph.branch({
  parent: master,
  name: 'feature/add-footer',
  col: col.feature[2]
});
feature3.commit('step1').commit('step2');

feature1.checkout();
let release1 = gitgraph.branch({
  name: 'release/0.0.2.1',
  tag: '被0.0.2.2抢占合并',
  column: col.release[0]
});

master.merge(release1, {tag: '[失效]0.0.2.1被0.0.2.2抢占合并', tagColor: "gray",message: 'merge master and run CI CD'});

feature2.checkout();
let release2 = gitgraph.branch({
  name: 'release/0.0.2.2',
  column: col.release[1]
});

master.merge(release2, {message: 'merge master and run CI CD'});
feature3.merge(release2, {message: 'push to test'});

release2.merge(master, {message: '测试通过', tag: '0.0.2'});

feature1.checkout();
let release3 = gitgraph.branch({
  name: 'release/0.0.3.1',
  column: col.release[2]
});
master.merge(release3, {message: 'merge master and run CI CD'});

release3.merge(master, {message: '重新测试通过', tag: '0.0.3'});
