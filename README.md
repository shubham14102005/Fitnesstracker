🏋️ Fitness Tracker Application

A simple and efficient Fitness Tracker Web Application built using Spring Boot, Spring Data JPA, and MySQL. This application helps users track their daily fitness activities, monitor progress, and manage health data.

🚀 Features
✅ Add daily fitness activities
📊 Track calories burned
📝 Maintain workout logs
🔍 View activity history
✏️ Update and delete records
💾 Persistent data storage using MySQL
🛠️ Tech Stack
Backend: Spring Boot
Database: MySQL
ORM: Spring Data JPA (Hibernate)
Build Tool: Maven
IDE: Eclipse
📂 Project Structure
FitnessTracker/
│── src/main/java/com/example/fitnesstracker
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   └── FitnessTrackerApplication.java
│
│── src/main/resources
│   ├── application.properties
│
│── pom.xml
⚙️ Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/fitness-tracker.git
cd fitness-tracker
2. Configure MySQL Database

Create a database in MySQL:

CREATE DATABASE fitness_tracker;

Update application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/fitness_tracker
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
3. Run the Application

Using Eclipse:

Right-click project → Run As → Spring Boot App

Or using terminal:

mvn spring-boot:run
🌐 API Endpoints
Method	Endpoint	Description
GET	/activities	Get all activities
POST	/activities	Add new activity
PUT	/activities/{id}	Update activity
DELETE	/activities/{id}	Delete activity
📌 Example Request
Add Activity
POST /activities

{
  "activityName": "Running",
  "duration": 30,
  "caloriesBurned": 250,
  "date": "2025-03-07"
}
🧱 Entity Example
@Entity
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String activityName;
    private int duration;
    private int caloriesBurned;
    private LocalDate date;
}
🔮 Future Enhancements
🔐 User Authentication (Login/Register)
📱 Frontend (React / Angular)
📈 Charts for progress tracking
🧠 AI-based fitness suggestions
📅 Weekly/Monthly reports
🤝 Contributing

Contributions are welcome!

Fork the repo
Create a new branch
Commit your changes
Push to your branch
Create a Pull Request
📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Shubham Vaghani
