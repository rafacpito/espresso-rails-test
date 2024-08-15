# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    return if user.nil?
    
    return admin_permissions if user.admin?
    normal_permissions(user)
  end

  def admin_permissions
    can :manage, Card
    can :manage, Category
    can :manage, Company
    can :manage, Statement
    can :manage, User
    can [:read, :destroy], Statement 
  end

  def normal_permissions(user)
    can [:create, :read, :update], Attachment
    can [:read, :list, :update], Statement
    can [:read], Category
  end
end
