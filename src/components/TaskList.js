import TaskForm from "./TaskForm";
import Task from "./Task";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loadingImg from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });

  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.post(`${URL}/api/tasks`, formData);
      toast.success("Task added successfully");
      setFormData({ ...formData, name: "" });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${URL}/api/tasks`);
      setTasks(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getTasks();
  }, []);
  const taskList = (data) => {
    return (
      <>
        {data.map((task, index) => (
          <Task
            key={task._id}
            task={task}
            index={index}
            deleteTask={deleteTask}
            getSingleTask={getSingleTask}
            toggleComplete={toggleComplete}
          />
        ))}
      </>
    );
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error);
    }
  };
  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskId(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Edit field cannot be empty");
    }
    try {
      await axios.patch(`${URL}/api/tasks/${taskId}`, formData);
      toast.success("Task updated successfully");
      setFormData({ ...formData, name: "" });
      setIsEditing(false);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const toggleComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: !task.completed,
    };
    try {
      await axios.patch(`${URL}/api/tasks/${task._id}`, newFormData);
      setFormData({ ...formData, name: "" });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks: </b> {tasks.length}
          </p>
          <p>
            <b>Completed Tasks: </b>
            {tasks.reduce((count, task) => {
              return count + (task.completed ? 1 : 0);
            }, 0)}
          </p>
        </div>
      )}
      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loadingImg} alt="Loading" />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No task added. Please add a task</p>
      ) : (
        taskList(tasks)
      )}
    </div>
  );
};

export default TaskList;
