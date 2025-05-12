import random

class Room:
    def __init__(self, is_starting_room=False):
        self.vases = random.randint(0, 3)
        self.monster = None if is_starting_room else self.spawn_monster()

    def describe(self):
        print("You have entered a new room.")
        if self.monster:
            print(f"A {self.monster.name} is in the room!")
        else:
            print("The room is empty.")
        
        if self.vases == 0:
            print("There are no vases in this room.")
        else:
            print(f"There are {self.vases} vases in this room.")

    def spawn_monster(self):
        if random.random() <= 0.4:  
            monsters = [Minotaur(), Zombie(), Knight()]
            return random.choice(monsters)
        return None

    def break_vase(self, player):
        if self.vases > 0:
            self.vases -= 1
            print("You broke a vase!")
            if random.random() <= 0.2:  
                self.drop_item(player)
        else:
            print("There are no vases to break.")

    def drop_item(self, player):
        items = ['health potion', 'sword', 'spear', 'poison']
        item = random.choice(items)
        print(f"A {item} dropped from the vase!")
        if item == 'health potion':
            player.inventory.append(item)
            print("You can save this health potion or use it to restore 5 health.")
            use = input("Do you want to use the health potion now? (yes/no): ").strip().lower()
            if use == 'yes':
                player.use_health_potion()
        elif item == 'sword':
            player.damage += 1
            print("You picked up a sword! Your damage increased by 1.")
        elif item == 'spear':
            player.damage += 3
            print("You picked up a spear! Your damage increased by 3.")
        elif item == 'poison':
            player.health -= 1
            player.damage = max(0, player.damage - 1)
            print("You got poisoned! You lost 1 health and your damage decreased by 1.")

    def fight_monster(self, player):
        if self.monster:
            print(f"You engage in combat with the {self.monster.name}!")
            while player.health > 0 and self.monster.health > 0:
                print("\nChoose an action:")
                print("1. Attack")
                print("2. Use Health Potion")
                action = input("Enter 1 or 2: ").strip()

                if action == '1':
                    self.monster.health -= player.damage
                    print(f"You attack the {self.monster.name} for {player.damage} damage.")
                    if self.monster.health <= 0:
                        print(f"You defeated the {self.monster.name}!")
                        if isinstance(self.monster, DoOmY):
                            print("Congratulations! You have defeated DoOmY and won the game!")
                            exit()  
                        self.monster = None
                        return True
                    player.health -= self.monster.damage
                    print(f"The {self.monster.name} attacks you for {self.monster.damage} damage.")
                elif action == '2':
                    player.use_health_potion()
                    if player.health <= 0:
                        print("You have been defeated!")
                        return False
                else:
                    print("Invalid action. Please choose again.")
                
                if player.health <= 0:
                    print("You have been defeated!")
                    return False
            self.monster = None
        return True

class Monster:
    def __init__(self, name, health, damage):
        self.name = name
        self.health = health
        self.damage = damage

class Minotaur(Monster):
    def __init__(self):
        super().__init__('Minotaur', 10, 5)

class Zombie(Monster):
    def __init__(self):
        super().__init__('Zombie', 3, 5)

class Knight(Monster):
    def __init__(self):
        super().__init__('Knight', 10, 2)

class DoOmY(Monster):
    def __init__(self):
        super().__init__('DoOmY', 50, 10)

class Player:
    def __init__(self):
        self.health = 100
        self.damage = 2
        self.inventory = []

    def use_health_potion(self):
        if 'health potion' in self.inventory:
            self.health += 5
            self.inventory.remove('health potion')
            print("You used a health potion and restored 5 health.")
        else:
            print("You don't have a health potion to use.")

    def display_stats(self):
        print(f"Health: {self.health}, Damage: {self.damage}")
        if self.inventory:
            print(f"Inventory: {', '.join(self.inventory)}")
        else:
            print("Inventory: empty")

class Dungeon:
    def __init__(self, player):
        self.current_room = Room(is_starting_room=True)
        self.previous_room = None
        self.move_count = 0
        self.player = player

    def move(self, direction):
        if direction in ["left", "right", "up", "down"]:
            if direction == "down" and self.current_room is None:
                print("You can't move down from the starting room.")
                return

            if self.current_room.monster:
                if not self.current_room.fight_monster(self.player):
                    print("You died!! Game Over.")
                    return

            self.move_count += 1

            if self.move_count % 3 == 0:
                if not self.solve_math_problem():
                    print("Incorrect answer! Returning to the previous room.")
                    self.current_room = self.previous_room
                    self.current_room.describe()
                    return

            if self.move_count >= 5 and random.random() <= 0.5:  
                print("A powerful presence fills the room...")
                self.current_room.monster = DoOmY()
                self.current_room.describe()
            else:
                self.previous_room = self.current_room
                self.current_room = Room()
                self.current_room.describe()
        else:
            print("Invalid direction! Use left, right, up, or down.")

    def break_vase(self):
        self.current_room.break_vase(self.player)

    def solve_math_problem(self):
        num1 = random.randint(1, 99)
        num2 = random.randint(1, 99)
        operation = random.choice(['+', '-'])
        if operation == '+':
            correct_answer = num1 + num2
        else:
            correct_answer = num1 - num2

        user_answer = input(f"Solve this problem to continue: {num1} {operation} {num2} = ")
        
        try:
            user_answer = int(user_answer)
            return user_answer == correct_answer
        except ValueError:
            return False

def main():
    player = Player()
    dungeon = Dungeon(player)
    print("Welcome to Jhoop! You are Jhoop the travelling hero. You are tasked to defeating DoOmY the town terrorizer. Traverse the dungeon, and become the Hero!")
    dungeon.current_room.describe()

    while True:
        player.display_stats()
        command = input("Enter a command (move left/right/up/down, break vase, use potion, or quit): ").strip().lower()
        if command.startswith("move"):
            _, direction = command.split()
            dungeon.move(direction)
        elif command == "break vase":
            dungeon.break_vase()
        elif command == "use potion":
            player.use_health_potion()
        elif command == "quit":
            print("Thank you for playing!")
            break
        else:
            print("Invalid command!")

if __name__ == "__main__":
    main()