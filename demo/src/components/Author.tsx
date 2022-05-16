import { CMSComponent } from './types';

interface Props {
  name: string;
  href: string;
}

export default function Author({ name, href }: Props) {
  return (
    <div className="author" style={{ marginBottom: '0.75rem' }}>
      <p>
        <a {...{ href }}>{name}</a>
      </p>
    </div>
  );
}

export const CMSAuthor: CMSComponent<Props> = {
  component: Author,
  fields: [
    {
      name: 'name',
      label: 'Author Name',
      widget: 'string',
    },
    {
      name: 'href',
      label: 'Author Link',
      widget: 'string',
    },
  ],
};
