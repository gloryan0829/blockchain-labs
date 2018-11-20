import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
      <Menu style={{ marginTop : '5px' }}>
          <link
              rel="stylesheet"
              href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css">
          </link>
          <Link route="/">
            <a className="item">
                크라우드펀딩
            </a>
          </Link>
          <Menu.Menu position="right">
            <Link route="/">
                <a className="item">캠페인리스트</a>
            </Link>
            <Link route="/campaigns/new">
                <a className="item">+</a>
            </Link>
          </Menu.Menu>
      </Menu>
    );
}