class HanoiGame {
  constructor(count) {
    this.init(count);
  }

  init(count) {
    this.state = {
      disksCount: count,
      pegs: [[], [], []],
      moves: 0,
      selectedPeg: null,
      isAutoSolving: false
    };

    // 初始化数组（栈）
    for (let i = count; i >= 1; i--) {
      this.state.pegs[0].push(i);
    }

    this.render();
  }

  /* 渲染 DOM */
  render() {
    document.getElementById("moveCounter").textContent = this.state.moves;

    document.querySelectorAll(".peg").forEach((pegEl, i) => {
      pegEl.innerHTML = "";

      this.state.pegs[i].forEach((size, index) => {
        const disk = document.createElement("div");

        disk.className = "disk";
        disk.dataset.size = size;

        disk.style.width = (60 + size * 15) + "px";
        disk.style.bottom = index * 22 + "px";

        pegEl.appendChild(disk);
      });
    });
  }

  /* 检查合法性 */
  isValidMove(from, to) {
    const fromPeg = this.state.pegs[from];
    const toPeg = this.state.pegs[to];

    if (fromPeg.length === 0) return false;

    const moving = fromPeg[fromPeg.length - 1];
    const top = toPeg[toPeg.length - 1];

    return !top || moving < top;
  }

  /* 执行移动 */
  move(from, to) {
    if (!this.isValidMove(from, to)) {
      this.showMessage("⚠️ 无效移动！");
      return;
    }

    const disk = this.state.pegs[from].pop(); // 必用 pop()
    this.state.pegs[to].push(disk);           // 必用 push()

    this.state.moves++;
    this.render();

    if (this.checkWin()) {
      this.showMessage("🎉 胜利！", true);
    }
  }

  /* 胜利检测 */
  checkWin() {
    return this.state.pegs[2].length === this.state.disksCount;
  }

  /* 提示 */
  showMessage(msg, win=false) {
    const el = document.getElementById("message");
    el.textContent = msg;
    el.className = win ? "win" : "warning";

    setTimeout(() => {
      el.textContent = "";
      el.className = "";
    }, 1500);
  }

  /* 自动解题（递归） */
  autoSolve(n, from=0, to=2, aux=1) {
    if (this.state.isAutoSolving) return;
    this.state.isAutoSolving = true;

    const steps = [];

    function solve(n, from, to, aux) {
      if (n === 1) {
        steps.push([from, to]);
        return;
      }
      solve(n-1, from, aux, to);
      steps.push([from, to]);
      solve(n-1, aux, to, from);
    }

    solve(n, from, to, aux);

    let i = 0;
    const interval = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(interval);
        this.state.isAutoSolving = false;
        return;
      }

      const [f, t] = steps[i];
      this.move(f, t);
      i++;

    }, 600);
  }
}

/* 初始化 */
let game = new HanoiGame(5);

/* 事件绑定 */
document.querySelectorAll(".peg").forEach((peg, index) => {
  peg.addEventListener("click", () => {
    if (game.state.isAutoSolving) return;

    if (game.state.selectedPeg === null) {
      game.state.selectedPeg = index;
    } else {
      game.move(game.state.selectedPeg, index);
      game.state.selectedPeg = null;
    }
  });
});

/* 输入变化 */
document.getElementById("diskInput").addEventListener("change", (e) => {
  const val = +e.target.value;
  document.getElementById("diskCount").textContent = val;
  game.init(val);
});

/* 重置 */
document.getElementById("resetBtn").onclick = () => {
  game.init(game.state.disksCount);
};

/* 自动解 */
document.getElementById("autoBtn").onclick = () => {
  game.autoSolve(game.state.disksCount);
};

