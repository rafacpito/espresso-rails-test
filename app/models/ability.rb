# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    return if user.nil?

    admin_permissions if user.admin?

    normal_permissions(user) if user.employee?
  end

  def admin_permissions
    can :manage, Card
    can :manage, Category
    can :manage, Company
    can :manage, User
    can %i[read destroy list index_archived], Statement
  end

  def normal_permissions(_user)
    can %i[create read update], Attachment
    can %i[read list update], Statement
    can [:read], Category
  end
end
