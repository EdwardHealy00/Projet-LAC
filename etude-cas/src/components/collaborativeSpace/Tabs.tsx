import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormStudy from './formStudy';
import EditFormStudy from './editFormStudy';
import CaseStudy from './caseStudy/CaseStudy';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [isCaseStudy, setIsCaseStudy] = React.useState(false);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }} id="formStudyContent"> 
       {isCaseStudy && 
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Étude de cas" {...a11yProps(0)} />
            <Tab label="Utiliser ce cas dans un cours" {...a11yProps(1)} />
            <Tab label="Adapter ce cas pour votre cours" {...a11yProps(2)} />
          </Tabs>
        </Box> &&
        <TabPanel value={value} index={0}>
          <CaseStudy />
        </TabPanel>
      } 
      
      {!isCaseStudy &&
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Fiche sujet" {...a11yProps(0)} />
            <Tab label="Modifier la fiche sujet" {...a11yProps(1)} />
            <Tab label="Ajouter l'étude de cas à la fiche sujet" {...a11yProps(2)} />
          </Tabs>
        </Box> &&
        <><TabPanel value={value} index={0}>
          <FormStudy setIsCaseStudy={setIsCaseStudy} />
        </TabPanel><TabPanel value={value} index={1}>
            <EditFormStudy />
          </TabPanel></>
      }

    </Box>
  );
}