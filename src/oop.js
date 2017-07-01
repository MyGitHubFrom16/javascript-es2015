document.addEventListener("DOMContentLoaded", console.log("DOMContentLoaded"));



class Person {
    constructor(name, gender, age) {
        this.name = name;
        this.gender = gender;
        this.age = age;
        console.log("create a new Person");
    }

    info() {
        console.log(`name is a ${this.name}...`);
    }
}

let Andre = new Person("Ander", "PHP", 29);
Andre.info();

