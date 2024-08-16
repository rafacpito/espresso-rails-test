# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Statements::Update do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company) }
  let(:card) { create(:card, user: employee) }
  let(:statement) { create(:statement, card: card) }
  let(:category) { create(:category, company: admin.company) }
  let(:params) do
    {
      category_id: category.id,
      file: ActionDispatch::Http::UploadedFile.new(
        tempfile: File.new(Rails.root.join('app/assets/images/logo.png')),
        filename: File.basename(File.new(Rails.root.join('app/assets/images/logo.png'))),
        type: 'image/png'
      )
    }
  end
  let(:cloudinary_fake_response) do
    {
      'asset_id' => '13',
      'public_id' => '13',
      'version' => 132,
      'version_id' => '123',
      'signature' => '123',
      'width' => 150,
      'height' => 32,
      'format' => 'png',
      'resource_type' => 'image',
      'created_at' => '2024-08-16T05:32:22Z',
      'tags' => [],
      'bytes' => 2247,
      'type' => 'upload',
      'etag' => '123123',
      'placeholder' => false,
      'url' => 'http://google.com/baymimbfln2aeb03mt8t.png',
      'secure_url' => 'https://google.com/baymimbfln2aeb03mt8t.png',
      'asset_folder' => '',
      'display_name' => '123123',
      'original_filename' => 'test',
      'api_key' => '123123'
    }
  end

  describe '#initialize' do
    let(:instance) { described_class.new(statement.id, params, employee) }

    it 'id to be instancied' do
      expect(instance.id).to eq(statement.id)
    end

    it 'params to be instancied' do
      expect(instance.params).to eq(params)
    end

    it 'current_user to be instancied' do
      expect(instance.current_user).to eq(employee)
    end
  end

  describe '#execute' do
    context 'when params valids' do
      let(:old_statement) { statement }
      let(:response) { described_class.new(statement.id, params, employee).execute }

      before do
        allow(Cloudinary::Uploader).to receive(:upload).and_return(cloudinary_fake_response)
      end

      it 'returns statement object' do
        expect(response.class).to eq(Statement)
      end

      it 'category_id updated' do
        expect(old_statement.category_id).not_to eq(params[:category_id])
        expect(response.category_id).to eq(params[:category_id])
      end

      it 'file updated' do
        expect(response.attachment).to be_present
      end

      it 'statement status is proven now' do
        expect(old_statement.status).to eq(Statement::UNPROVEN_STATUS)
        expect(response.status).to eq(Statement::PROVEN_STATUS)
      end
    end

    context 'when params valids and statement already has attachment' do
      let(:statement_new) { create(:statement, card: card) }
      let(:old_statement) { statement_new }
      let(:response) { described_class.new(statement_new.id, params, employee).execute }

      before do
        create(:attachment, statement: statement_new)
        statement_new.reload
        allow(Cloudinary::Uploader).to receive(:upload).and_return(cloudinary_fake_response)
      end

      it 'returns statement object' do
        expect(response.class).to eq(Statement)
      end

      it 'category_id updated' do
        expect(old_statement.category_id).not_to eq(params[:category_id])
        expect(response.category_id).to eq(params[:category_id])
      end

      it 'file updated' do
        expect(response.attachment).to be_present
      end

      it 'statement status is proven now' do
        expect(old_statement.status).to eq(Statement::UNPROVEN_STATUS)
        expect(response.status).to eq(Statement::PROVEN_STATUS)
      end
    end

    context 'when category invalid' do
      let(:params_invalid) do
        {
          category_id: 'invalid',
          file: ActionDispatch::Http::UploadedFile.new(
            tempfile: File.new(Rails.root.join('app/assets/images/logo.png')),
            filename: File.basename(File.new(Rails.root.join('app/assets/images/logo.png'))),
            type: 'image/png'
          )
        }
      end
      let(:response) { described_class.new(statement.id, params_invalid, employee).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'when category from another company' do
      let(:other_admin) { create(:user) }
      let(:category_other_company) { create(:category, company: other_admin.company) }
      let(:params_invalid) do
        {
          category_id: category_other_company.id,
          file: ActionDispatch::Http::UploadedFile.new(
            tempfile: File.new(Rails.root.join('app/assets/images/logo.png')),
            filename: File.basename(File.new(Rails.root.join('app/assets/images/logo.png'))),
            type: 'image/png'
          )
        }
      end
      let(:response) { described_class.new(statement.id, params_invalid, employee).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'when file not send' do
      let(:params_invalid) do
        {
          category_id: category.id,
          file: nil
        }
      end
      let(:response) { described_class.new(statement.id, params_invalid, employee).execute }

      it 'raises CustomException exception' do
        expect { response }.to raise_error(CustomException)
      end
    end

    context 'when unsupported format' do
      let(:params_invalid) do
        {
          category_id: category.id,
          file: ActionDispatch::Http::UploadedFile.new(
            tempfile: File.new(Rails.root.join('app/assets/images/random.svg')),
            filename: File.basename(File.new(Rails.root.join('app/assets/images/random.svg'))),
            type: 'image/svg'
          )
        }
      end
      let(:response) { described_class.new(statement.id, params_invalid, employee).execute }

      it 'raises CustomException exception' do
        expect { response }.to raise_error(CustomException)
      end
    end
  end
end
