import React, { useEffect, useState } from 'react';
import supabase from '../functions/supabase';
import styles from '../styles/kanban.module.css';
import palette from '../styles/palette';
import Modal from './Modal/Modal';

function DragAndDropColumns() {
  const defaultGroups = ['To Do', 'In Progress', 'Code Review', 'Testing', 'QA', 'Done'];

  async function getCards() {
    let { data: kanbanCards, error } = await supabase.from('kanbanCards').select('*');
    setItems(kanbanCards);
    let projectNames = [];
    if (kanbanCards) {
      for (let i = 0; i < kanbanCards.length; i++) {
        if (kanbanCards[i].project_name) {
          projectNames.push(kanbanCards[i].project_name);
        }
      }
    }
    setProjects(projectNames);
  }

  async function getDevNames() {
    let { data: devs, error } = await supabase.from('devs').select('*');
  }

  async function assignCardToDev(itemId: number, dev: string) {
    const { data, error } = await supabase.from('kanbanCards').update({ assigned_to: dev }).eq('id', itemId);
    getCards();
  }

  useEffect(() => {
    getCards();
    getDevNames();
  }, []);

  const [developers, setDevelopers] = useState([] as any);
  const [items, setItems] = useState([] as any);
  const [dragData, setDragData] = useState({} as any);
  const [noDrop, setNoDrop] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [developerAssigned, setDeveloperAssigned] = useState('');
  const [adding, setAdding] = useState(false);
  const [projects, setProjects] = useState([] as any);
  const [selectedProject, setSelectedProject] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDragStart = (e: any, id: number, group: string) => {
    setDragData({ id: id, initialGroup: group });
  };

  const handleDragEnter = (e: any, group: string) => {
    if (group === 'noDrop') {
      setNoDrop('noDrop');
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  async function changeCategory(itemId: number, group: string) {
    const { data, error } = await supabase.from('kanbanCards').update({ status: group }).eq('id', itemId);
    getCards();
  }

  const handleDrop = (e: any, group: string) => {
    setNoDrop('');
    const selected = dragData.id;
    if (group === 'noDrop') {
    } else {
      changeCategory(selected, group);
    }
  };

  async function addTask(e: any) {
    e.preventDefault();
    setAdding(true);
    const { data, error } = await supabase.from('kanbanCards').insert([
      {
        title: taskName,
        description: taskDescription,
        status: 'To Do',
        assigned_to: developerAssigned,
        project_name: selectedProject,
      },
    ]);
    getCards();
    setAdding(false);
    setShowModal(false);
  }

  async function CreateProject(e: any) {
    e.preventDefault();
    setCreating(true);
    const { data, error } = await supabase.from('kanbanCards').insert([{ project_name: newProjectName }]);
    getCards();
    setCreating(false);
    setShowNewProjectModal(false);
  }

  async function addToCompletedProjects(items: any) {
    items.map(async (item: any) => {
      if (item.project_name == selectedProject) {
        const { data, error } = await supabase.from('completedKanbanCards').insert([
          {
            created_at: item.created_at,
            title: item.title,
            description: item.description,
            status: item.status,
            assigned_to: item.assigned_to,
            project_name: item.project_name,
          },
        ]);
      }
    });
  }

  async function handleCompleteProject(items: any) {
    setDeleting(true);
    if (confirm(`Are you sure this project is finished? \n\n This cannot be undone.`)) {
      addToCompletedProjects(items);
      items.map(async (item: any) => {
        if (item.project_name == selectedProject) {
          const { data, error } = await supabase.from('kanbanCards').delete().eq('project_name', item.project_name);
        }
      });
      getCards();
    } else {
      setDeleting(false);
    }
    getCards();
  }

  let uniqueProjects = projects.filter((name: string, index: number) => {
    return projects.indexOf(name) === index;
  });

  return (
    <>
      {deleting ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form style={{ width: '50%' }}>
            <p>Project was completed successfully!</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowNewProjectModal(true);
              }}
            >
              {' '}
              Would you like to create another ?
            </button>
          </form>
        </div>
      ) : (
        <div style={{ margin: '-30px 0 10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <select onClick={(e: any) => setSelectedProject(e.target.value)} style={{ width: 'fit-content' }}>
            <option value={selectedProject ? selectedProject : ''}>Pick A Project</option>
            {uniqueProjects.map((project: string, index: number) => {
              return (
                <option key={index} value={project}>
                  {project}
                </option>
              );
            })}
          </select>
          <button
            className='dev-ticket-button'
            style={{ margin: '0 0 0 20px', padding: '10px 20px', fontSize: '21px' }}
            onClick={(e) => {
              e.preventDefault();
              setShowNewProjectModal(true);
            }}
          >
            Start New Project
          </button>
        </div>
      )}
      {showNewProjectModal ? (
        <Modal
          styleOverride={{
            maxHeight: '90vh',
            padding: '5px',
            overflowY: 'auto',
            backgroundColor: palette.pageBackgroundColor,
            width: '50%',
            margin: '10% 25%',
            height: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            border: '1px solid rgba(0, 0, 0, 0.4)',
            borderRadius: '10px',
            color: 'black',
          }}
        >
          <p
            style={{ marginLeft: 'auto', marginRight: '20px', cursor: 'pointer', padding: '10px' }}
            onClick={() => setShowNewProjectModal(false)}
          >
            X
          </p>
          <form style={{ border: 'none' }}>
            <label style={{ margin: '10px 0' }}>New Project Name:</label>
            <input type='text' onChange={(e) => setNewProjectName(e.target.value)} />
            <button
              style={{ marginBottom: '20px' }}
              onClick={(e) => {
                CreateProject(e);
                setDeleting(false);
              }}
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        </Modal>
      ) : null}
      {deleting ? null : selectedProject ? (
        <>
          <KanbanTable
            showModal={showModal}
            setShowModal={setShowModal}
            setTaskName={setTaskName}
            setTaskDescription={setTaskDescription}
            setDeveloperAssigned={setDeveloperAssigned}
            developers={developers}
            addTask={addTask}
            adding={adding}
            defaultGroups={defaultGroups}
            handleDragEnter={handleDragEnter}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            items={items}
            selectedProject={selectedProject}
            handleDragStart={handleDragStart}
            assignCardToDev={assignCardToDev}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              className='dev-ticket-button'
              style={{ padding: '10px 20px', fontSize: '21px', margin: '10px 0 0 0' }}
              onClick={() => handleCompleteProject(items)}
            >
              Complete Project
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}

function KanbanTable({
  showModal,
  setShowModal,
  setTaskName,
  setTaskDescription,
  setDeveloperAssigned,
  developers,
  addTask,
  adding,
  defaultGroups,
  handleDragEnter,
  handleDragOver,
  handleDrop,
  items,
  selectedProject,
  handleDragStart,
  assignCardToDev,
}: {
  showModal: boolean;
  setShowModal: Function;
  setTaskName: Function;
  setTaskDescription: Function;
  setDeveloperAssigned: Function;
  developers: any;
  addTask: Function;
  adding: boolean;
  defaultGroups: any;
  handleDragEnter: Function;
  handleDragOver: (e: any) => void;
  handleDrop: Function;
  items: any;
  selectedProject: string;
  handleDragStart: Function;
  assignCardToDev: Function;
}) {
  return (
    <>
      {showModal ? (
        <Modal
          styleOverride={{
            maxHeight: '90vh',
            padding: '5px',
            overflowY: 'auto',
            backgroundColor: palette.pageBackgroundColor,
            width: '50%',
            margin: '10% 25%',
            height: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            border: '1px solid rgba(0, 0, 0, 0.4)',
            borderRadius: '10px',
            color: 'black',
          }}
        >
          <p
            style={{ marginLeft: 'auto', marginRight: '20px', cursor: 'pointer', padding: '10px' }}
            onClick={() => setShowModal(false)}
          >
            X
          </p>
          <form style={{ border: 'none' }}>
            <label style={{ margin: '10px 0' }}>Task Name:</label>
            <input type='text' onChange={(e) => setTaskName(e.target.value)} />
            <label style={{ margin: '10px 0' }}>Task Description:</label>
            <textarea onChange={(e) => setTaskDescription(e.target.value)} />
            <label style={{ margin: '10px 0' }}>Assigned To:</label>
            <select style={{ margin: '0 0 10px 0' }} onClick={(e: any) => setDeveloperAssigned(e.target.value)}>
              <option value={''}>{'Can choose later...'}</option>
              {developers.map((dev: any) => {
                return (
                  <option key={dev.id} value={dev.name}>
                    {dev.name}
                  </option>
                );
              })}
            </select>
            <button style={{ marginBottom: '20px' }} onClick={(e) => addTask(e)}>
              {adding ? 'Adding...' : 'Add'}
            </button>
          </form>
        </Modal>
      ) : null}
      <div
        style={{
          display: 'flex',
          margin: '5px',
          padding: '5px',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}
      >
        {defaultGroups.map((group: string) => (
          <div
            key={group}
            className={styles.column}
            onDragEnter={(e) => handleDragEnter(e, group)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, group)}
          >
            <h1 style={{ textAlign: 'center', margin: '0 0 12px 0' }}>{group}</h1>
            <hr style={{ border: '1px solid black', width: '100%', margin: '0 0 10px 0' }} />
            <div>
              {items
                .filter((item: any) => item.status === group && item.project_name === selectedProject)
                .map((item: any, index: number) => (
                  <div
                    key={item.id}
                    id={item.id.toString()}
                    className={styles.items}
                    draggable
                    onDragStart={(e) => {
                      handleDragStart(e, item.id, group);
                    }}
                  >
                    <OpenCard item={item} developers={developers} assignCardToDev={assignCardToDev} />
                  </div>
                ))}
              {group === 'To Do' ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 10px 0' }}>
                  <button
                    className='dev-ticket-button'
                    onClick={(e) => {
                      e.preventDefault();
                      setShowModal(true);
                    }}
                  >
                    + Add Task
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function OpenCard({ item, developers, assignCardToDev }: { item: any; developers: any; assignCardToDev: Function }) {
  const [clicked, setClicked] = useState(false);

  return (
    <>
      <button
        style={{
          float: 'right',
          margin: '0 0 0 0',
          cursor: 'pointer',
          padding: '5px 10px',
          borderRadius: '10px',
          color: palette.pageBackgroundColor,
        }}
        onClick={() => setClicked(true)}
      >
        {clicked ? 'Opened' : 'Open'}
      </button>
      <p>{item.title}</p>
      <TaskCard
        item={item}
        developers={developers}
        assignCardToDev={assignCardToDev}
        clicked={clicked}
        setClicked={setClicked}
      />
    </>
  );
}

function TaskCard({
  item,
  developers,
  assignCardToDev,
  clicked,
  setClicked,
}: {
  item: any;
  developers: any;
  assignCardToDev: Function;
  clicked: boolean;
  setClicked: Function;
}) {
  return clicked ? (
    <Modal
      styleOverride={{
        maxHeight: '90vh',
        padding: '10px',
        overflowY: 'auto',
        backgroundColor: palette.pageBackgroundColor,
        width: '50%',
        margin: '10% 25%',
        height: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        border: '1px solid rgba(0, 0, 0, 0.4)',
        borderRadius: '10px',
        color: 'black',
      }}
    >
      <p
        style={{ marginLeft: 'auto', marginRight: '0px', cursor: 'pointer', padding: '10px', marginBottom: 0 }}
        onClick={() => setClicked(false)}
      >
        X
      </p>
      <p>
        <span style={{ fontWeight: 700 }}>Status: </span>
        {item.status}
      </p>
      <p>
        <span style={{ fontWeight: 700 }}>Title: </span>
        {item.title}
      </p>
      <p>
        <span style={{ fontWeight: 700 }}>Description: </span>
        {item.description}
      </p>
      <AssignedTo item={item} developers={developers} assignCardToDev={assignCardToDev} />
    </Modal>
  ) : null;
}

function AssignedTo({ item, developers, assignCardToDev }: { item: any; developers: any; assignCardToDev: Function }) {
  return !item.assigned_to ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <AssignCardToDev developers={developers} assignCardToDev={assignCardToDev} item={item} />
    </div>
  ) : (
    <p>
      <span style={{ fontWeight: 700 }}>Assigned To:</span> {item.assigned_to}
    </p>
  );
}

function AssignCardToDev({
  developers,
  assignCardToDev,
  item,
}: {
  developers: any;
  assignCardToDev: Function;
  item: any;
}) {
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [setting, setSetting] = useState(false);

  return (
    <>
      <select style={{ width: '100%' }} onClick={(e: any) => setSelectedDeveloper(e.target.value)}>
        {developers.map((dev: any) => (
          <option key={dev.id} value={dev.name}>
            {dev.name}
          </option>
        ))}
      </select>
      <button
        className='dev-ticket-button'
        style={{ margin: '5px 0 0 0' }}
        onClick={(e) => {
          e.preventDefault;
          assignCardToDev(item.id, selectedDeveloper), setSetting(true);
        }}
      >
        {setting ? 'Setting...' : 'Set'}
      </button>
    </>
  );
}

export default DragAndDropColumns;
