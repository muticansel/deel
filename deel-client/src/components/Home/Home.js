import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

function App() {
    return (
        <>
            <Button as={Link} to="/contracts">
                Get CONTRACTS
            </Button>
            {/* <Button as={Link} to="/contracts">
                Best Profession
            </Button> */}
        </>
    );
}

export default App;
