import React from 'react';
import { Menu } from 'semantic-ui-react';

export default () => {
    return (
      <Menu style={{ marginTop : '5px' }}>
          <link
              rel="stylesheet"
              href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css">
          </link>
          <Menu.Item>
              크라우드코인
          </Menu.Item>
          <Menu.Menu position="right">
              <Menu.Item>
                  펀딩
              </Menu.Item>
              <Menu.Item>
                  +
              </Menu.Item>
          </Menu.Menu>
      </Menu>
    );
}