const TaskForm = ({
  createTask,
  name,
  handleInputChange,
  isEditing,
  updateTask,
}) => {
  return (
    <div>
      <form
        className="task-form"
        onSubmit={!isEditing ? createTask : updateTask}
      >
        <input
          type="text"
          placeholder="Add a Task"
          name="name"
          value={name}
          onChange={handleInputChange}
        />
        <button type="submit">{isEditing ? "Edit" : "Add"}</button>
      </form>
    </div>
  );
};

export default TaskForm;
