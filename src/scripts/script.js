let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting = null;
let monsterHealth = null;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");
const buttonSave = document.querySelector("#buttonSave");
const buttonLoad = document.querySelector("#buttonLoad");
const buttonRestart = document.querySelector("#buttonRestart");
const buttonCloseModal = document.querySelector("#buttonCloseModal");
const text = document.querySelector("#text");
const text2 = document.querySelector("#text2");
const text3 = document.querySelector("#text3");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

if (!localStorage.getItem("gameData")) {
  localStorage.setItem(
    "gameData",
    JSON.stringify({
      xp: 0,
      health: 100,
      gold: 50,
      currentWeapon: 0,
      inventory: ["stick"],
    })
  );
} else {
  xp = JSON.parse(localStorage.getItem("gameData")).xp;
  health = JSON.parse(localStorage.getItem("gameData")).health;
  gold = JSON.parse(localStorage.getItem("gameData")).gold;
  currentWeapon = JSON.parse(localStorage.getItem("gameData")).currentWeapon;
  inventory = JSON.parse(localStorage.getItem("gameData")).inventory;
  healthText.innerText = health;
  xpText.innerText = xp;
  goldText.innerText = gold;
}

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60,
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
  },
];

const weapons = [
  {
    name: "stick",
    power: 5,
  },
  {
    name: "dagger",
    power: 30,
  },
  {
    name: "claw hammer",
    power: 50,
  },
  {
    name: "sword",
    power: 100,
  },
];

const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "Store".',
  },
  {
    name: "store",
    "button text": [
      "Buy 10 health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge (50%)", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
  },
  {
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [goTown, goTown, goTown],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [
      () => handleSaves("restart"),
      () => handleSaves("restart"),
      () => handleSaves("restart"),
    ],
    text: "You die. ☠️",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [
      () => handleSaves("restart"),
      () => handleSaves("restart"),
      () => handleSaves("restart"),
    ],
    text: "You defeat the dragon! YOU WIN THE GAME! 🎉",
  },
];

const locations2 = [
  {
    name: "pannel",
    "button text": ["Inventory"],
    "button functions": [showInventory],
    text: `Here you can manage your character.`,
  },
  {
    name: "inventory",
    "button text": ["Sell trash"],
    "button functions": [sellTrash],
    text: `Inventory:\n`,
  },
];

goldText.innerText = gold;
xpText.innerText = xp;
healthText.innerText = health;
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
button4.onclick = showInventory;
buttonSave.onclick = () => handleSaves("save");
buttonLoad.onclick = () => handleSaves("load");
buttonRestart.onclick = () => handleSaves("restart");
buttonCloseModal.onclick = () =>
  document.querySelector("#modal").classList.add("hidden");

function handleSaves(prop) {
  if (prop === "save") {
    if (button1.innerText !== "Go to store") {
      text3.innerText = "Saves are available only in the town square";
      document.querySelector("#modal").classList.remove("hidden");

      return;
    }

    localStorage.setItem(
      "gameData",
      JSON.stringify({
        xp: xp,
        health: health,
        gold: gold,
        currentWeapon: currentWeapon,
        inventory: inventory,
      })
    );
    text3.innerText = "Game saved successfully";
    document.querySelector("#modal").classList.remove("hidden");
  } else if (prop === "load") {
    if (button1.innerText !== "Go to store") {
      text3.innerText = "Loads are available only in the town square";
      document.querySelector("#modal").classList.remove("hidden");

      return;
    }

    xp = JSON.parse(localStorage.getItem("gameData")).xp;
    health = JSON.parse(localStorage.getItem("gameData")).health;
    gold = JSON.parse(localStorage.getItem("gameData")).gold;
    currentWeapon = JSON.parse(localStorage.getItem("gameData")).currentWeapon;
    inventory = JSON.parse(localStorage.getItem("gameData")).inventory;

    healthText.innerText = health;
    xpText.innerText = xp;
    goldText.innerText = gold;

    text3.innerText = "Game loaded successfully";
    document.querySelector("#modal").classList.remove("hidden");
  } else {
    localStorage.setItem(
      "gameData",
      JSON.stringify({
        xp: 0,
        health: 100,
        gold: 50,
        currentWeapon: 0,
        inventory: ["stick"],
      })
    );

    healthText.innerText = 100;
    xpText.innerText = 0;
    goldText.innerText = 50;

    text3.innerText = "Game restarted successfully";
    document.querySelector("#modal").classList.remove("hidden");

    fighting = null;
    monsterHealth = null;

    monsterStats.style.display = "none";

    goTown();
  }
}

function update(location) {
  [button1, button2, button3].map((i, index) => {
    i.innerText = location["button text"][index];
    i.onclick = location["button functions"][index];
  });

  text.innerText = location.text;
}

function update2(location) {
  [button4].map((i, index) => {
    i.innerText = location["button text"][index];
    i.onclick = location["button functions"][index];
  });

  text2.innerText = location.text;
}

function showInventory() {
  update2(locations2.find((i) => i.name === "inventory"));
  text2.innerText += `${inventory.map((i) => " " + i)}`;

  document.querySelector("#buttonBack").classList.remove("hidden");
  document.querySelector("#buttonBack").onclick = exitInventory;
}

function exitInventory() {
  update2(locations2.find((i) => i.name === "pannel"));
  document.querySelector("#buttonBack").classList.add("hidden");
}

function sellTrash() {
  if (inventory?.length === 1) {
    text2.innerText = "You dont have any trash";
    return;
  }

  gold = gold + 15 * (inventory?.length - 1);
  inventory = inventory.filter((i) => i === weapons[currentWeapon].name);
  goldText.innerText = gold;
  text2.innerText = "Inventory:\n" + `${inventory.map((i) => " " + i)}`;
}

function goStore() {
  update(locations.find((i) => i.name === "store"));
}

function goCave() {
  update(locations.find((i) => i.name === "cave"));
}

function goTown() {
  update(locations.find((i) => i.name === "town square"));
}

function buyHealth() {
  if (gold < 10) {
    text.innerText = "You do not have enough gold to buy health";
    return;
  }

  gold -= 10;
  health += 10;
  goldText.innerText = gold;
  healthText.innerText = health;
  text.innerText = "You've restored 10 HP";
}

function buyWeapon() {
  if (gold < 30) {
    text.innerText = "You do not have enough gold to buy weapon";
    return;
  }

  if (currentWeapon === weapons?.length - 1) {
    text.innerText = "You already have best weapon in a game";
    return;
  }

  gold -= 30;
  currentWeapon += 1;
  goldText.innerText = gold;
  text.innerText = `You now have a ${weapons[currentWeapon].name}`;
  inventory.push(weapons[currentWeapon].name);

  if (button4.innerText === "Sell trash") {
    update2(locations2.find((i) => i.name === "inventory"));
    text2.innerText = "Inventory:\n" + `${inventory.map((i) => " " + i)}`;
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}
function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations.find((i) => i.name === "fight"));
  monsterStats.style.display = "block";
  monsterHealth = monsters[fighting].health;
  monsterHealthText.innerText = monsters[fighting].health;
  monsterNameText.innerText = monsters[fighting].name;
}

function attack() {
  health -= monsters[fighting].level;
  healthText.innerText = health;

  let randomXpDamageBoost = Math.floor(Math.random() * xp) + 1;
  monsterHealth =
    monsterHealth - weapons[currentWeapon].power - randomXpDamageBoost;
  monsterHealthText.innerText = monsterHealth;

  text.innerText = `The ${monsters[fighting].name} attacks dealing ${monsters[fighting].level} damage!`;
  text.innerText += `\nYou attacking with your ${
    weapons[currentWeapon].name
  } dealing ${weapons[currentWeapon].power + randomXpDamageBoost} damage!`;

  if (health <= 0) loose();
  else if (monsterHealth <= 0) {
    if (fighting === 2) update(locations.find((i) => i.name === "win"));
    else defetMonster();
  }
}

function dodge() {
  if (Math.random() < 0.5) {
    text.innerText =
      "Success!\nYou dodge the attack from the " +
      monsters[fighting].name +
      ` and deale double damage!`;
    monsterHealth = monsterHealth - weapons[currentWeapon].power * 2;
    monsterHealthText.innerText = monsterHealth;
  } else {
    text.innerText = `Loose!\nMonster attacks dealing ${
      monsters[fighting].level * 2
    } damage!`;
    health = health - monsters[fighting].level * 2;
    healthText.innerText = health;
  }

  if (health <= 0) loose();
  else if (monsterHealth <= 0) defetMonster();
}

function loose() {
  update(locations.find((i) => i.name === "lose"));
}

function defetMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  monsterStats.style.display = "none";
  update(locations.find((i) => i.name === "kill monster"));
}
